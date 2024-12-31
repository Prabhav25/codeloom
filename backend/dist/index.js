"use strict";
//The first request goes to the /template endpoint to determine whether the project should be built with React or Node by sending a prompt to the AI. Based on the AI's response ("node" or "react"), the server returns relevant prompts. The second request then goes to the /chat endpoint, where the LLM generates detailed content or initial files for the project based on the chosen framework, using the context provided from the first request.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config(); //loads environment variables from a .env. To keep sensitive information like API keys, tokens, or database credentials outside of the codebase for security.
const express_1 = __importDefault(require("express")); //A lightweight framework for building web servers in Node.js to handle HTTP requests
const sdk_1 = __importDefault(require("@anthropic-ai/sdk")); //A library to interact with Anthropic’s AI APIs
const prompts_1 = require("./prompts"); //A base structure or initial template for generating responses, generates system-level instructions for the AI.
const node_1 = require("./defaults/node"); //Specific templates for Node.js
const react_1 = require("./defaults/react"); //Specific templates React projects.
const cors_1 = __importDefault(require("cors")); // Middleware to allow cross-origin requests (requests from different domains), allowing secure communication across different websites
const anthropic = new sdk_1.default();
const app = (0, express_1.default)(); //Creates an instance of the Express server.
app.use((0, cors_1.default)()); //Adds Cross-Origin Resource Sharing, which allows requests from other domains.
app.use(express_1.default.json()); // to parse incoming JSON data into a JavaScript object for you to use in your routes. For example when Handling API requests with JSON data, receiving data from frontend forms submitted as JSON.
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //This sets up a new endpoint for your Express application, app.post to send data from the client to the server. The callback function is async, allowing you to use await for handling asynchronous operations like API calls or database queries. req: The request object containing data sent by the client. res: The response object used to send a reply back to the client.
    //This endpoint determines whether the project is better suited to a React or Node.js setup.
    const prompt = req.body.prompt; //Extracts the prompt from the body of the incoming request (req.body). req.body contains the parsed body of the request.
    const response = yield anthropic.messages.create({
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
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    });
    const answer = response.content[0].text; // Extract the first item in the content array of the response object as a TextBlock. The .text property of the TextBlock object contains the AI's response (e.g., "react" or "node").
    if (answer == "react") {
        res.json({
            //Sends a JSON response back to the client
            prompts: [
                //prompts is a key that holds an array of text prompts
                prompts_1.BASE_PROMPT, //predefined string or template that contains general instructions.
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [react_1.basePrompt], // uiPrompts is the key in the JSON object, containing an array with React-specific UI instructions. reactBasePrompt has react specific instructions, so it is defined in react.ts such that UI needs to see these files mentioned in the prompt and render all of these files in a web container.
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [node_1.basePrompt], //uiPrompts key contains a Node.js-specific instructions
        });
        return;
    }
    res.status(403).json({ message: "You cant access this" }); // If the answer is neither "react" nor "node" it sets the HTTP status code to 403, which means Forbidden. This is used when the server understands the request, but the client is not allowed to access the resource.
    return;
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // The /chat endpoint handles a more general chat-based conversation, allowing the user to send multiple messages and receive a generated response from the AI
    const messages = req.body.messages; //The request body here contains an array of multiple messages under the messages key.
    const response = yield anthropic.messages.create({
        messages: messages,
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8000,
        system: (0, prompts_1.getSystemPrompt)(), //API is expected to return a more detailed response
    });
    console.log(response);
    res.json({
        response: (_a = response.content[0]) === null || _a === void 0 ? void 0 : _a.text,
    });
}));
app.listen(3000);
