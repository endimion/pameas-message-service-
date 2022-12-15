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
        `mumbleService, I found the user for the given name:${message.sender.name}`
      );

      if (
        userDetails &&
        userDetails.networkInfo &&
        userDetails.networkInfo.deviceInfoList
      ) {
      }
      // console.log(userDetails);
      // console.log(
      //   `mac address of user ${
      //     userDetails.networkInfo.deviceInfoList[
      //       userDetails.networkInfo.deviceInfoList.length - 1
      //     ].hashedMacAddress
      //   }`
      // );
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
          // message.reply("okay");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

const sendMessageToUser = (
  client,
  user,
  messageStr,
  imgStr = null,
  attempt = 0
) => {
  // console.log(`will send to user ${user} the message ${messageStr}`);
  if (!(messageStr == null && imgStr == null) && attempt < 10) {
    let theUser = client.users.find("name", user);
    let count = attempt + 1;
    if (theUser) {
      console.log(`trying to send ${messageStr} to the user with name ${user}`);
      if (imgStr) {
        const regex = new RegExp("^(<header>)+(.+?(?=(</div>)))");
        let theMessage = messageStr.replace(regex, replaceCurrying(imgStr));
        if (theMessage != null)
          theUser
            .sendMessage(theMessage)
            .catch((err) => {
              console.log(`error sending ${messageStr} to passenger ${user}`);
              console.log(err);
              console.log(`failed to send message retrying in 10`);

              setTimeout(() => {
                sendMessageToUser(client, user, messageStr, imgStr, count);
              }, 10000);
            })
            .then((resp) => {
              let users = resp.users._array;
              if (users && users[0].name === user) {
                // console.log(users[0].name);
              } else {
                console.log(`error getting ack from user ${user}`);
                setTimeout(() => {
                  sendMessageToUser(client, user, messageStr, imgStr, count);
                }, 10000);
              }
            });
      } else {
        theUser
          .sendMessage(messageStr)
          .catch((err) => {
            console.log(`error sending ${messageStr} to passenger ${user}`);
            console.log(err);
            setTimeout(() => {
              sendMessageToUser(client, user, messageStr, imgStr, count);
            }, 10000);
          })
          .then((resp) => {
            let users = resp.users._array;
            if (users && users[0].name === user) {
              // console.log(users[0].name);
            } else {
              console.log(`error getting ack from user ${user}`);
              setTimeout(() => {
                sendMessageToUser(client, user, messageStr, imgStr, count);
              }, 10000);
            }
          });
      }
    } else {
      console.log(`couldnt find a muble user with the name ${user}`);
      setTimeout(() => {
        sendMessageToUser(client, user, messageStr, imgStr, count);
      }, 10000);
    }
  } else {
    if (attempt !== 10) console.log(`no data were added to the message`);
    console.log(`10 attempts reached for trying to reach user ${user}`);
  }
};

const replaceCurrying = (imageTag) => {
  return (match, offset) => {
    return match + imageTag; //+ "</div></main>:: sound: siren"
  };
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
