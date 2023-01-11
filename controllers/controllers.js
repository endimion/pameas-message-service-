const express = require("express");
const router = express.Router();
const { sendMessageToUser } = require("../services/mumbleService");
const { sendMessageTactilon } = require("../services/TactilonService");
const { getUser } = require("../services/DBProxyService");
const { saveMessage } = require("../services/ElasticService");
const { base64ImageFromFilePath } = require("../services/imageUtilsService");
const Prometheus = require("prom-client");
 // Create a Registry which registers the metrics
const register = new Prometheus.Registry()
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'pameas-messaging-service'
})
// Enable the collection of default metrics
Prometheus.collectDefaultMetrics({ register })


let client;

class RouterFactory {
  constructor(mumbleClient) {
    this.mumbleClient = mumbleClient;
    client = mumbleClient;
    this.router = router;
  }

  getRouter() {
    return this.router;
  }
}

// middleware that is specific to this router
router.use((req, res, next) => {
  // console.log(`Time: ${Date.now()}, URI: ${req.url}`);
  const responseTimeInMs = Date.now() ;

  // After each response
  // httpRequestDurationMicroseconds
  //   .labels(req.path)
  //   .observe(responseTimeInMs);
  next();
});

// define the home page route
router.get("/", (req, res) => {
  res.send("Router is working ok");
});


// Metrics endpoint
router.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType)
  let result = register.metrics()
  res.end(await register.metrics())
})


router.post("/sendMessageMumble", async (req, res) => {
  let hashedMacAddress = req.body.hashedMacAddress;
  let content = req.body.content;
  let imagePath = req.body.imagePath;
  try {
    let user = await getUser(hashedMacAddress);
    if (user != undefined && user.networkInfo != undefined) {
      let mumbleId = user.networkInfo.messagingAppClientId;
      if (!imagePath) {
        //"Mumla_User"
        sendMessageToUser(client, mumbleId, content);
        // saveMessage("pameas_evacuation_assistant", mumbleId, content);
      } else {
        let image = await base64ImageFromFilePath(imagePath);
        sendMessageToUser(client, mumbleId, image);
        // saveMessage("pameas_evacuation_assistant", mumbleId, image);
      }

      res.sendStatus(200);
    }
  } catch (error) {
    console.log(`error getting user ${error}`);
    res.sendStatus(500);
  }
});

router.post("/sendMessageMumbleBulk", async (req, res) => {
  // let type = req.body.type;
  let listOfRequests = req.body.receivers;
  // console.log(listOfRequests)

  listOfRequests.forEach(async (request) => {
    let hashedMacAddress = request.recipient;
    let content = request.textMsg;
    let imagePath = request.visualAid;
    try {
      let user = await getUser(hashedMacAddress);
      if (user != null && user != undefined && user.networkInfo != undefined) {
        let mumbleId = user.networkInfo.messagingAppClientId;

        if (!imagePath) {
          //"Mumla_User"
          sendMessageToUser(client, mumbleId, content);
          // saveMessage("pameas_evacuation_assistant", mumbleId, content);
        } else {
          let image = await base64ImageFromFilePath(imagePath);
          sendMessageToUser(client, mumbleId, content, image);
          // saveMessage("pameas_evacuation_assistant", mumbleId, image);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  res.sendStatus(200);
});

router.post("/sendMessageTactilonBulk", async (req, res) => {
  let listOfRequests = req.body.receivers;
  listOfRequests.forEach(async (request) => {
    let hashedMacAddress = request.recipient;
    let content = request.textMsg;
    let imagePath = request.imageFile;
    try {
      let user = await getUser(hashedMacAddress);
      if (user != undefined && user.networkInfo != undefined) {
        let msisdn = user.networkInfo.messagingAppClientId;
        sendMessageTactilon(msisdn, content);
        // saveMessage("pameas_evacuation_assistant", msisdn, content);
      }
    } catch (error) {
      console.log(`error getting user ${error}`);
    }
  });

  res.sendStatus(200);
});

router.post("/sendMessageTactilon", async (req, res) => {
  let msisdn = req.body.msisdn;
  let content = req.body.content;
  try {
    sendMessageTactilon(msisdn, content);
    // saveMessage("pameas_evacuation_assistant", msisdn, content);

    res.sendStatus(200);
  } catch (error) {
    console.log(`error getting user ${error}`);
    res.sendStatus(500);
  }
});

exports.RouterFactory = RouterFactory;
