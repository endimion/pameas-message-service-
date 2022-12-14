const express = require("express");
const router = express.Router();
const { sendMessageToUser } = require("../services/mumbleService");
const { sendMessageTactilon, getOAuth2AccessToken, getMessages } = require("../services/TactilonService");
const { getUser } = require("../services/DBProxyService");
const { saveMessage } = require("../services/ElasticService");
const { base64ImageFromFilePath } = require("../services/imageUtilsService");

let client;

class TestRouterFactory {
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
  console.log(`Time: ${Date.now()}, URI: ${req.url}`);
  next();
});

router.post("/sendEmergencyMessage", async (req, res) => {
  let image = await base64ImageFromFilePath("image1.png");
  sendMessageToUser(client, "Mumla_User", "yo",image);
  res.sendStatus(200);
});


router.get("/makeOAuth", async (req,res) => {
  let bearer = getOAuth2AccessToken()
  sendMessageTactilon(306943808730,"this is a backend message")
  // getMessages(306943808730)
});



router.post("/sendHtmlMessage", async (req, res) => {
  let image = await base64ImageFromFilePath("image1.png");
  let content = `<h3>Emergency Alert</h3><div><b>Please Move Immediately to <span style='color: red'>Muster Station B</span></b></div> located at the Restaurant (Lounge Area) of  <span style='color: red'>Deck 7</spa>`
  sendMessageToUser(client, "Mumla_User", content,null);
  res.sendStatus(200);
});



exports.TestRouterFactory = TestRouterFactory;
