//The first request goes to the /template endpoint to determine whether the project should be built with React or Node by sending a prompt to the AI. Based on the AI's response ("node" or "react"), the server returns relevant prompts. The second request then goes to the /chat endpoint, where the LLM generates detailed content or initial files for the project based on the chosen framework, using the context provided from the first request.

require("dotenv").config(); //loads environment variables from a .env. To keep sensitive information like API keys, tokens, or database credentials outside of the codebase for security.
import express from "express"; //A lightweight framework for building web servers in Node.js to handle HTTP requests
import Anthropic from "@anthropic-ai/sdk"; //A library to interact with Anthropic’s AI APIs
import { BASE_PROMPT, getSystemPrompt } from "./prompts"; //A base structure or initial template for generating responses, generates system-level instructions for the AI.

import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
import { basePrompt as nodeBasePrompt } from "./defaults/node"; //Specific templates for Node.js
import { basePrompt as reactBasePrompt } from "./defaults/react"; //Specific templates React projects.
import cors from "cors"; // Middleware to allow cross-origin requests (requests from different domains), allowing secure communication across different websites

const anthropic = new Anthropic();
const app = express(); //Creates an instance of the Express server.
app.use(cors()); //Adds Cross-Origin Resource Sharing, which allows requests from other domains.
app.use(express.json()); // to parse incoming JSON data into a JavaScript object for you to use in your routes. For example when Handling API requests with JSON data, receiving data from frontend forms submitted as JSON.

app.post("/template", async (req, res) => {
  //This sets up a new endpoint for your Express application, app.post to send data from the client to the server. The callback function is async, allowing you to use await for handling asynchronous operations like API calls or database queries. req: The request object containing data sent by the client. res: The response object used to send a reply back to the client.

  //This endpoint determines whether the project is better suited to a React or Node.js setup.
  const prompt = req.body.prompt; //Extracts the prompt from the body of the incoming request (req.body). req.body contains the parsed body of the request.
  const response = await anthropic.messages.create({
    //Calls the create method of the messages property of the anthropic object. Waits for the create operation to complete asynchronously before moving to the next line. Stores the result of the operation, which is expected to be a response from the Claude model.
    messages: [
      {
        role: "user", //Specifies the role of the sender
        content: prompt, //The actual message content is the prompt received from the user in the request body.
      },
    ],
    model: "claude-3-5-sonnet-20241022", //Specifies which AI model to use for generating a response
    max_tokens: 200, //Specifies the number of tokens (words or parts of words) the response can have
    //Provides guidance or constraints to the AI about how to respond.
    system:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  });

  const answer = (response.content[0] as TextBlock).text; // Extract the first item in the content array of the response object as a TextBlock. The .text property of the TextBlock object contains the AI's response (e.g., "react" or "node").
  if (answer == "react") {
    res.json({
      //Sends a JSON response back to the client
      prompts: [
        //prompts is a key that holds an array of text prompts
        BASE_PROMPT, //predefined string or template that contains general instructions.
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt], // uiPrompts is the key in the JSON object, containing an array with React-specific UI instructions. reactBasePrompt has react specific instructions, so it is defined in react.ts such that UI needs to see these files mentioned in the prompt and render all of these files in a web container.
    });
    return;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt], //uiPrompts key contains a Node.js-specific instructions
    });
    return;
  }

  res.status(403).json({ message: "You cant access this" }); // If the answer is neither "react" nor "node" it sets the HTTP status code to 403, which means Forbidden. This is used when the server understands the request, but the client is not allowed to access the resource.
  return;
});

app.post("/chat", async (req, res) => {
  // The /chat endpoint handles a more general chat-based conversation, allowing the user to send multiple messages and receive a generated response from the AI
  const messages = req.body.messages; //The request body here contains an array of multiple messages under the messages key.
  const response = await anthropic.messages.create({
    messages: messages,
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8000,
    system: getSystemPrompt(), //API is expected to return a more detailed response
  });

  console.log(response);

  res.json({
    response: (response.content[0] as TextBlock)?.text,
  });
});

app.listen(3000);
