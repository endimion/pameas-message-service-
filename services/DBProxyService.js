const axios = require("axios");
const qs = require("qs");

const getUser =  (hashedMacAddress) => {
  return new Promise(async (resolve, reject) => {
    let DB_PROXY_URL = process.env.DB_PROXY_URL
    ? process.env.DB_PROXY_URL
    // : "http://localhost:8080";
    :"http://dss.aegean.gr:8090"

  axios
    .get(
      `${DB_PROXY_URL}/getPersonByHashedMac?hashedMac=${hashedMacAddress}`,
      {
        headers: {
          Authorization: `Bearer ${await getOAuth2AccessToken()}`,
        },
      }
    )
    .then(function (response) {
      // console.log("response.data")
      // console.log(response.data);
      resolve(response.data)
    })
    .catch(function (error) {
      console.log(`error getting user with hashedMacAddress:${hashedMacAddress}`)
      // console.error(error.code + "---" + error.response.status);
      reject(error.code)
    });
  })
  
};


const getUserByMumbleName =  (mumbleName) => {
  return new Promise(async (resolve, reject) => {
    let DB_PROXY_URL = process.env.DB_PROXY_URL
    ? process.env.DB_PROXY_URL
    // : "http://localhost:8080";
    :"http://dss.aegean.gr:8090"

  axios
    .get(
      `${DB_PROXY_URL}/findUserFromMumbleName?mumbleName=${mumbleName}`,
      {
        headers: {
          Authorization: `Bearer ${await getOAuth2AccessToken()}`,
        },
      }
    )
    .then(function (response) {
      // console.log("response.data")
      // console.log(response.data);
      resolve(response.data)
    })
    .catch(function (error) {
      console.log(`error getting user with hashedMacAddress:${hashedMacAddress}`)
      // console.error(error.code + "---" + error.response.status);
      reject(error.code)
    });
  })
  
};





async function getOAuth2AccessToken() {
  let keycloakAuthTokenEndpoint = process.env.KEYCLOAK_OAUTH_TOKEN
    ? process.env.KEYCLOAK_OAUTH_TOKEN
    : "https://dss1.aegean.gr/auth/realms/palaemon/protocol/openid-connect/token";
  let client_id = "palaemonRegistration";
  let client_secret = "bdbbb8d5-3ee7-4907-b95c-2baae17bd10f";
  return (
    await axios({
      method: "post",
      url: keycloakAuthTokenEndpoint,
      data: qs.stringify({
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "client_credentials",
        scope: "openid",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).data.access_token;
}

exports.getUser = getUser;
exports.getUserByMumbleName = getUserByMumbleName;
