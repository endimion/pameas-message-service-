const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");

let certificatePath = process.env.IS_PRODUCTION
  ? "/certs/dfb.palaemon.itml.gr"
  : "/home/ni/code/java/palaemon-db-proxy/dfb.palaemon.itml.gr";

const client = new Client({
  node: "https://dfb.palaemon.itml.gr",
  auth: {
    username: "esuser",
    password: "kyroCMA2081!",
  },
  tls: {
    ca: fs.readFileSync(certificatePath),
    rejectUnauthorized: false,
  },
});

async function saveMessage(sender, recipient, content) {
  let d = new Date();
  let datestring =
    d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
  let indexString = "pameas-messages-" + datestring;

  // Let's start by indexing some data
  await client.index({
    index: indexString,
    document: {
      sender: sender,
      recipient: recipient,
      content: content,
    },
  });

  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  await client.indices.refresh({ index: indexString });
}

exports.saveMessage = saveMessage;
