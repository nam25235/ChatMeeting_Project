require("dotenv").config();
const dialogflow = require("dialogflow");
const uuid = require("uuid");

// A unique identifier for the given session
const sessionId = uuid.v4();

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const projectId = process.env.PROJECT_ID;
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
// /**
//  * Send a query to the dialogflow agent, and return the query result.
//  * @param {string} projectId The project to be used
//  */
const packRequest = async (text) => {
  // The text query request.
  return {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };
};

const callDialogflow = async (request) => {
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
};

const runSample = async () => {
  const request = await packRequest("Hi Dialogflow");
  await callDialogflow(request);
  const request1 = await packRequest("What should I do?");
  await callDialogflow(request1);
};

runSample();
