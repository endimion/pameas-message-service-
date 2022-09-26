const axios = require("axios");
const qs = require("qs");

let tokenObject = getOAuth2AccessToken();
let tokenExpirationTimeInSeconds = 0;

// crew members have registered their msisdn so we can contact them via that
async function sendMessageTactilon(receiverMSISDN, content) {
  try {
    // if (tokenExpirationTimeInSeconds === 0 || tokenHasExpired()) {
    //   tokenObject = getOAuth2AccessToken();
    //   tokenExpirationTimeInSeconds =
    //     Math.round(Date.now() / 1000) + tokenObject.expires_in;
    // }
    let token = await getOAuth2AccessToken(); //.data.access_token;
    let backendURI = `https://api.ea-1.eu-west-1.agnet.com/api/v2/subscriber/${receiverMSISDN}/message`;

    // console.log(`I hage the following access token`);
    // console.log(token);

    console.log(
      `Making request.... to ${receiverMSISDN} with content ${content}`
    );
    await axios({
      method: "post",
      url: backendURI,
      data: {
        Message: {
          Text: content,
          Recipients: [{ Msisdn: receiverMSISDN }],
          IsGroupMessage: false,
          Attachment: {
            Content: "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            FileName: "test",
          },
          Bearer: "NFC",
          AvailableOnlyRecipients: false,
          RequiresAcknowledge: true,
        },
        DeleteAfterSending: false,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMessages(receiverMSISDN) {
  try {
    let token = await tokenObject; //.data.access_token;
    let backendURI = `https://api.ea-1.eu-west-1.agnet.com/api/v2/subscriber/${receiverMSISDN}/message?Offset=0&Records=50`;
    console.log(`Making request....`);
    console.log(token);
    await axios.get(backendURI, {
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "content-type: application/json",
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function getOAuth2AccessToken() {
  try {
    let tactilonCodeEndpoint = process.env.TACTILON_CODE_ENDPOINT
      ? process.env.TACTILON_CODE_ENDPOINT
      : "https://openid-keycloak-test.tactilon-smartwisp.com/auth/realms/master/protocol/openid-connect/token";

    let code = (
      await axios({
        method: "post",
        url: tactilonCodeEndpoint,
        data: qs.stringify({
          username: "triantafyllou.ni@gmail.com",
          password: "UAegean2022!",
          grant_type: "password", // Do not alter
          client_id: "kong", // Do not alter
          client_secret: "cb59044f-f674-455c-8798-ee11c169c861",
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      })
    ).data.access_token;

    // console.log(code);

    // let tactilonTokenEndpoint = process.env.TACTILON_TOKEN_ENDPOINT
    //   ? process.env.TACTILON_TOKEN_ENDPOINT
    //   : "https://openid-keycloak-test.tactilon-smartwisp.com/auth/realms/master/protocol/openid-connect/token";

    // let token = await axios({
    //   method: "post",
    //   url: tactilonCodeEndpoint,
    //   data: qs.stringify({
    //     grant_type: "authorization_code",
    //     client_id: "kong",
    //     client_secret: "cb59044f-f674-455c-8798-ee11c169c861",
    //     redirect_uri: "YOUR_REDIRECT_URI",
    //     code_verifier: "YOUR_GENERATED_CODE_VERIFIER",
    //     code: code,
    //   }),
    //   headers: {
    //     "content-type": "application/x-www-form-urlencoded",
    //   },
    // });

    return code;
  } catch (err) {
    console.log("error getting TACTILON OAUTH CODE");
    console.log(err.response);
    return null;
  }

  // return "token";
}

/*
async function getOAuth2AccessToken() {
  try {
    let tactilonCodeEndpoint = process.env.TACTILON_CODE_ENDPOINT
      ? process.env.TACTILON_CODE_ENDPOINT
      : "http://openid-keycloak-test.tactilon-smartwisp.com/auth/realms/master/protocol/openid-connect/auth";

    let code = (
      await axios({
        method: "post",
        url: tactilonCodeEndpoint,
        data: qs.stringify({
          client_id: "pameas-messaging",
          response_type: "code",
          redirect_uri: "http://localhost:3000/test/test-oidc-response",
          scope: "openid",
          code_challenge: "YOUR_CODE_CHALLENGE",
          code_challenge_method: "S256",
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      })
    ).data.code;
  } catch (err) {
    console.log("!!!error getting TACTILON OAUTH CODE222");
    console.log(err.response);
    return null;
  }

  console.log(`I got the response ${code}`);

  let tactilonTokenEndpoint = process.env.TACTILON_TOKEN_ENDPOINT
    ? process.env.TACTILON_TOKEN_ENDPOINT
    : "http://openid-keycloak-test.tactilon-smartwisp.com/auth/realms/master/protocol/openid-connect/token";

  let token = await axios({
    method: "post",
    url: tactilonCodeEndpoint,
    data: qs.stringify({
      grant_type: "authorization_code",
      client_id: "kong",
      client_secret: "client_secret",
      redirect_uri: "YOUR_REDIRECT_URI",
      code_verifier: "YOUR_GENERATED_CODE_VERIFIER",
      code: code,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  return token;
}
*/

function tokenHasExpired() {
  return currentTimeInSeconds >= tokenExpirationTimeInSeconds;
}

exports.sendMessageTactilon = sendMessageTactilon;
exports.getOAuth2AccessToken = getOAuth2AccessToken;
exports.getMessages = getMessages;
