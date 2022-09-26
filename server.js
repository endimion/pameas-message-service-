const express = require("express");
const NoodleJS = require("noodle.js");
const app = express();
const PORT = 3000;

const {
  handleIncomingMessages,
  sendMessageToUser,
  sendMessageToChannel,
} = require("./services/mumbleService.js");

const { base64ImageFromFilePath } = require("./services/imageUtilsService");
const { cli } = require("winston/lib/winston/config/index.js");
const { RouterFactory } = require("./controllers/controllers");
const {TestRouterFactory} = require("./controllers/TestingRouters")
const { getUserByMumbleName } = require("./services/DBProxyService");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, async (error) => {
  if (!error) {
    const client = new NoodleJS({
      url: "195.251.134.194",
      port: 64739,
      name: "pameas_evacuation_assistant",
    });

    client.on("ready", (info) => {
      console.log(info.welcomeMessage);
    });

    // client.on("message", (message) => {
    //   if (message.content === "ping") {
    //     message.reply("pong");
    //   }
    // });

    client.connect();
    client.on("ready", async () => {
      try {
        handleIncomingMessages(client,getUserByMumbleName);

        let homeRouter = new RouterFactory(client);
        let testRouter = new TestRouterFactory(client);
        app.use("/", homeRouter.getRouter());
        app.use("/test",testRouter.getRouter())
      } catch (err) {
        console.log(err);
      }

      // let message = await base64ImageFromFilePath("dog2.png");
      // console.log(message)
      // sendMessageToUser(client, "Mumla_User", message);
      // sendMessageToChannel(client,"Root","hi channel")
    });
  }
});
