const axios = require("axios");
const qs = require("qs");

const handleIncomingMessages = async (client, getUserByMumbleName) => {
  // console.log("mumbleService handleIncomingMessages")

  let CONDUCTOR_URL = process.env.CONDUCTOR_URL
    ? process.env.CONDUCTOR_URL
    : "http://localhost:8080";

  client.on("message", async (message) => {
    console.log("MumbleService ***************************");
    console.log(message.sender.name);
    console.log(message.content);
    console.log("***************************");

    if (
      message.content === "SOS" ||
      message.content === "CALL_ME" ||
      message.content === "SICK" ||
      message.content === "FAMILY" ||
      message.content === "ACCIDENT"
    ) {
      //get userDetails
      let userDetails = await getUserByMumbleName(message.sender.name);
      console.log(
        `mumbleService, I found the user belof for the given name:${message.sender.name}`
      );
      
      if(userDetails && userDetails.networkInfo && userDetails.networkInfo.deviceInfoList){
        
      }
      console.log(userDetails);
      console.log(
        `mac address of user ${
          userDetails.networkInfo.deviceInfoList[
            userDetails.networkInfo.deviceInfoList.length - 1
          ].hashedMacAddress
        }`
      );
      console.log("***************************");
      //generate Kafka Issue

      // /api/workflow/detect_incident?priority=0

      axios({
        method: "post",
        url: CONDUCTOR_URL + "/api/workflow/detect_incident?priority=0",
        data: {
          passenger_id:
            userDetails.networkInfo.deviceInfoList[
              userDetails.networkInfo.deviceInfoList.length - 1
            ].hashedMacAddress,
        },
        headers: {
          "content-type": "application/json",
        },
      })
        .then((result) => {
          message.reply("okay");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

const sendMessageToUser = (client, user, messageStr, imgStr = null) => {
  console.log(`will send to user ${user} the message ${messageStr}`);

  if(imgStr){
    let theMessage = `<div>  <div>${messageStr} </div>  <div>${imgStr}</div> </div>`

    client.users
    .find("name", user)
    .sendMessage(theMessage)
    .catch((err) => {
      console.log(`error sending ${messageStr} to passenger ${user}`);
      console.log(err);
    });
  }else{
    client.users
    .find("name", user)
    .sendMessage(messageStr)
    .catch((err) => {
      console.log(`error sending ${messageStr} to passenger ${user}`);
      console.log(err);
    });
  }
  

};

const sendMessageToChannel = (client, channelName, messageStr) => {
  client.channels.find("name", channelName).sendMessage(messageStr);
};

//stream over all users
/*
        let keyIt = client.users.keys()
        let nextKey  = keyIt.next();
        while(nextKey.done !== true){
          console.log(client.users.get(nextKey.value))
          nextKey = keyIt.next()
        }
        */

exports.handleIncomingMessages = handleIncomingMessages;
exports.sendMessageToUser = sendMessageToUser;
exports.sendMessageToChannel = sendMessageToChannel;
