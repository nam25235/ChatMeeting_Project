require("dotenv").config();
const dialogflow = require("dialogflow");
const uuid = require("uuid");

// A unique identifier for the given session
const sessionId = uuid.v4();

// Create a new session
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
};
const sessionClient = new dialogflow.SessionsClient({
  projectId: process.env.PROJECT_ID,
  credentials,
});
const sessionPath = sessionClient.sessionPath(
  process.env.PROJECT_ID,
  sessionId
);
// /**
//  * Send a query to the dialogflow agent, and return the query result.
//  * @param {string} projectId The project to be used
//  */
const packRequest = async (text, language) => {
  // The text query request.
  return {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text,
        // The language used by the client (en-US)
        languageCode: language,
      },
    },
  };
};

// Call dialogflow engine
const callDialogflow = async (request) => {
  try {
    // Send request and log result
    let res_message = "";
    const responses = await sessionClient.detectIntent(request);
    // console.log("Detected intent");
    const result = responses[0].queryResult;
    // console.log("queryResult result");

    // use fulfillment
    if (result.fulfillmentMessages[0]) {
      console.log("result.fulfillmentMessages[0].text.text");
      console.log(result.fulfillmentMessages[0].text.text);
      res_message = result.fulfillmentMessages[0].text.text[0];
    }
    // just intent
    else {
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        // console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        // console.log(`  No intent matched.`);
      }
      res_message = result.fulfillmentText;
    }
    return res_message;
  } catch (err) {
    console.log(err.message);
  }
};

const userinfo_config = async (userid, roomid) => {
  try {
    // config user information
    let request = await packRequest(`ชื่อผู้ใช้: ${userid}`, "th");
    await callDialogflow(request);
    request = await packRequest(`รหัสห้อง: ${roomid}`, "th");
    let message = await callDialogflow(request);
    return message;
  } catch (err) {
    return false;
  }
};

const talkto_dialogflow = async (message, language) => {
  request = await packRequest(message, language);
  const bot_response = await callDialogflow(request);
  return bot_response;
};

module.exports = {
  userinfo_config,
  talkto_dialogflow,
};
