## [Project Outcome](https://www.loom.com/share/bae0038fc27f4e229986700a556a7d3c?sid=62d4d364-9904-46cb-bb8d-b5ab0b787f6c)


# About Codeloom
**Codeloom** is an innovative platform designed to streamline the process of code generation and visualization. By harnessing the power of AI and modern web technologies, Codeloom allows users to provide natural language prompts to generate code snippets dynamically, coupled with a real-time preview of how the generated code will render or function.

## Key Features
- **1. Prompt-based Code Generation**: Generates accurate code snippets using AI models like Claude.ai and Anthropic API.
- **2. Real-time Execution & Preview**: Uses Web Containers for instant browser-based code execution.
- **3. Interactive UI**: Built with React.js and Tailwind CSS for a responsive and user-friendly interface.
- **4. Multi-language Support**: Powered by LLMs to handle various programming languages and frameworks.
- **5. Robust Backend**: Scalable server-side logic with Node.js and Express.js.
- **6. CORS Integration**: Enables seamless API interactions.
- **7. Type Safety**: TypeScript ensures error-free and maintainable code.
- **8. Efficient API Calls**: Axios handles reliable data fetching and interactions.

-----

# How to run the project

**1. Clone the Repository**

- Use the following command to clone the project repository: ```git clone <repository-url>```

**2. Sign in to Anthropic Account**

- Visit the [Anthropic website](https://www.anthropic.com/api), click on Start Building and sign in to your account.
- Purchase credits as required to use their services.

**3. Generate an API Key**

- After purchasing credits, generate an API key from the Anthropic dashboard.
- Copy the API key.

**4. Add the API Key to the Backend**

- Navigate to the backend .env file in your project.
- Add the following line (replace <your-api-key> with the actual key): **ANTHROPIC_API_KEY=<your-api-key>**

**5. Run the Backend Server**

- Open a terminal and change the directory to the backend folder: cd backend
- Start the backend server using the command: npm run dev

**6. Run the Frontend Server**

- Open another terminal and change the directory to the frontend folder: cd frontend
- Start the frontend server using the command: npm run dev
- It may take some time to display the preview

**7. You’re Good to Go!**

- Access your application at the URL provided by the frontend development server.
- Verify that both frontend and backend are running seamlessly.



# About GPT Wrapper:

GPT is an artificial intelligence model that can generate human-like text based on the input it receives.
A "wrapper" in programming is like a helper tool. It "wraps" around something (like a complex program) and makes it easier to use.
A **GPT wrapper** is a piece of software or a program that makes it easier to interact with a GPT model, like ChatGPT. It provides a "layer" between the user and the GPT model.

## Real-life example:

Let’s say you want to build a chatbot for your website using GPT. Without a wrapper:

- You’d need to learn how to communicate with GPT directly using its API (which can be technical).
- You’d also have to handle all the input/output, error handling, and processing.

### With a wrapper:

- The wrapper simplifies these tasks. It might offer a single function like getGPTResponse(prompt) that takes your question, sends it to GPT, and gives you the answer.
- **Code example with Wrapper**:
  ```python
    import openai
    
    response = openai.ChatCompletion.create(
        model="gpt-4", 
        messages=[{"role": "user", "content": "Tell me a joke!"}]
    )
    
    print(response['choices'][0]['message']['content'])
    ```
  This **openai** Python library is a wrapper around OpenAI’s GPT API. The GPT-4 model should process the request. In this case, it’s a message from the user asking for a joke.

  **Without the wrapper**, you would have to:
  - Make a raw HTTP request to OpenAI’s API.
  - Handle the request parameters, such as the API key for authentication.
  - Format your input properly and structure the API call.
  - Parse the raw JSON response from the API to extract the answer.

The **openai.ChatCompletion.create()** function abstracts all of these steps into one simple call, making it easier to use GPT.

-----









# Codeloom Architecture
### Parsing the Response from an LLM: How to process it to generate a complete project code with multiple files.

![image](https://github.com/user-attachments/assets/b05c3f8b-499b-4ce2-a4fa-85b6188f8484)


The key aspect here is to engineer the prompt by modifying or enhancing it to ensure that the LLM responds in a specific format. Once the response is generated, the next crucial step is determining how to pass this response effectively to the web container within the website for execution.

**Example Response from LLM** => It returns structured steps for building a fitness page that can be executed one by one.

1) To initialize a react application like npm create vite@latest fitness –template
2) Install dependencies or libraries like Tailwind CSS.
3) Create a navbar.jsx file with the code returned by LLM.

The backend is responsible for parsing the response returned by the LLM. When the LLM generates multiple files and provides several steps, such as running commands like npm create vite or creating files like App.jsx, we need to determine where these commands are executed. To handle this, we divide our architecture into two approaches:

So we have two approaches: 
1) **Replit approach** – First, build a code execution environment where users can write code in the interface, click "Run," and have the code executed on a server. The execution should occur on the server, not in the browser. Users will then be able to visit the server to view the output or the creations generated by their code. The code will exist both in the browser and on the server, and when the "Run" button is clicked, it will be sent to the server for execution. However, if there are 50 browsers running, this setup would require 50 servers, leading to significant computational demand.
![](Aspose.Words.d59761aa-9de5-440c-804d-39cd8e9fbe15.002.png)

2) **Web containers approach by SlackBlitz**- In this approach, the browser provides a prompt, and the LLM returns a response containing multiple files. These files remain within the browser itself. A web container is created in the browser to execute the code locally. This eliminates the need for server-side execution, significantly reducing computation costs.


-----

# Programming 
Steps needed to interact with an LLM programmatically. This includes how to communicate with GPT APIs, obtain and use API keys like Claude keys, and leverage GPT wrappers to simplify these interactions. These topics will help you understand the process of effectively working with LLMs in your applications.

## Frontend Setup

1. **Initialize the Frontend:**
   1. Navigate to your project directory.
   1. Run the command: ```npm create vite@latest```
   1. Select the following options:
      1. Framework: React
      1. Variant: TypeScript
1. **Install Dependencies:**
   1. Navigate to the frontend folder and run: npm install

## Backend Setup

1. **Initialize the Backend:**
   1. Create a backend folder.
   1. Inside the backend folder, run: 
      ```npm init -y```
      ```npm install typescript```
      ```npx tsc --init```
1. **Configure tsconfig.json:**
   1. Open the tsconfig.json file and set the following properties:
      ```json
      {
        "rootDir": "./src",
        "outDir": "./dist"
      }
      ```

1. **Create Project Structure:**
   1. Inside the backend folder:
      1. Create a src folder.
      1. Create an index.ts file inside the src folder.
   1. Add a .env file outside the src folder and include the API key: **ANTHROPIC_API_KEY=your_api_key_here**
1. **Install dotenv:**
   1. To read .env files, install the dotenv dependency: ```npm install dotenv```
1. **Modify index.ts:**
   1. At the top of the index.ts file, add the following line to parse the .env file: ```require("dotenv").config();```
1. **Add a .env.example File:**
   1. Create a .env.example file in the backend folder with the following content: **ANTHROPIC_API_KEY=**
   1. **Note:** Do not include the actual API key in this file. It serves as a placeholder for others to understand where to add their own keys.
1. **Setup .gitignore:**
   1. Create a .gitignore file in the backend folder and add the following line to prevent .env from being pushed to GitHub: **.env**
1. **Update package.json:**
   1. Add a dev script in the scripts section of package.json to compile TypeScript and run the server:

      ```json
      {
        "scripts": {
          "dev": "tsc -b && node dist/index.js"
        }
      }
      ```


1. **Install the Anthropic SDK:**
   1. Run the following command in the backend folder to install: ```npm install @anthropic-ai/sdk```
   1. **Copy Anthropic Code:** Go to the [Anthropic Workbench](https://console.anthropic.com/workbench), copy the provided TypeScript code example from the documentation. Paste it into your index.ts file within the src folder.
   1. **Configure the Temperature:** In the pasted code, locate the temperature parameter.
      1. For analytical/multiple-choice tasks: Use values closer to 0.0.
      1. For creative/generative tasks: Use values closer to 1.0.


10. **Engineering the Prompt:** Let’s understand how Claude works. Suppose we give a user prompt to build a UI fitness page. The prompt does not directly reach Claude. Instead, there are some initial messages sent to Claude beforehand.
Open [bolt.new](https://bolt.new), search for something, open the network tab, click on chat, and go to the payload. In the "messages" section, you will see the first message. The first message typically looks like:
**“For all designs I ask you to make…”**
![image](https://github.com/user-attachments/assets/caf94726-7b9d-4232-8322-d5ae87c53f0e)


The second message contains files like eslint.config.js, index.html, package.json, etc. This message provides Claude with the **initial project context**. It essentially communicates that these files already exist. For instance, in a Vite project for React, the second message informs the LLM about the pre-existing structure of the project and requests it to consider this context when building the UI fitness page.

![image](https://github.com/user-attachments/assets/3ce7793a-98f5-4d2f-8bb7-1a34efe0a423)


The third message is the actual **user prompt**, which in this case is:
***“Build a UI fitness page.”***

11. Create **prompts.ts:** This file will contain predefined prompts to be used in the application.
Create **stripIndents.ts:** This file will include a utility function to remove unnecessary indentation and whitespace from strings.*
Create **constants.ts:** This file will store reusable constants, such as API endpoint URLs, configuration values, and default settings.

12. **Initial Request to /template:** Before the prompt is sent to the LLM, a request is first sent to the **/template** endpoint. This endpoint determines the type of application the prompt refers to, such as a React application, Next.js application, or Node.js application.

- **Return of Initial Files:** Based on the analysis of the prompt, the **/template** endpoint responds with the initial set of files required for the application.

- **Bolt Prompt Generation:** Using the returned files and additional context, a "bolt prompt" is generated. This prompt is then sent to the LLM for further processing and completion.

13. **Creating the template endpoint - storing default prompts for various frameworks.**
- **Create a New Folder**: 
   Inside the `src` directory, create a folder named `defaults`. 
   Inside the `defaults` folder, create two files: `node.ts`, and `react.ts`.

- **Fetch Base Prompts**: 
   Open the browser and navigate to **bolt.new**.

*Perform the following actions to fetch the base prompts:*

- **React Base Prompt**:
  - Search for something like **"Create a UI fitness page"**.
  - Go to the **Network** tab in the developer tools.
  - Search for **chat** in the network requests.
  - Locate the **messages** section and copy the **base prompt for React**.
- **Node.js Base Prompt**:
  - Search for something like **"Create a Node.js backend for a UI fitness page"**.
  - Go to the **Network** tab in the developer tools.
  - Search for **chat** in the network requests.
  - Locate the **messages** section and copy the **base prompt for Node.js**.

- **Add Prompts to Files**:

1. Paste the React base prompt into the **react.ts** file.

2. Paste the Node.js base prompt into the **node.ts** file.


14. **Creating project based on user prompt**: So whatever user gives us the prompt we have to figure out that react project has to be built or node.js project has to be built, based on which the request is sent to Claude.

1) Install express in the backend folder using the command ```npm install @types/express express```
2) **Write code in index.ts:** Set up **Express.js** server which interacts with the Anthropic AI model to handle two main functionalities:

1. **Project Template Identification**: Based on the user's description of a project, the AI determines whether it should be built with Node.js or React, and responds with appropriate prompts.
1. **AI Chat**: A chat feature where users can interact with the AI, and the server forwards the conversation messages to the AI model, returning the AI's response.

-----

# About CORS
It is a mechanism that allows your browser to request resources (like an API or a file) from a different domain than the one from which your website is served. Install CORS using the command ```npm i --save-dev @types/cors```

## Example Without CORS

Imagine your website is hosted on **http://mywebsite.com**. It tries to fetch data from **http://api.anotherdomain.com**.

```javascript
fetch("http://api.anotherdomain.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));
```

If the server at **http://api.anotherdomain.com** does not allow cross-origin requests, the browser will block the request and display an error in the console:

Access to fetch at **http://api.anotherdomain.com/data** from origin **http://mywebsite.com** has been blocked by CORS policy.

## Enabling CORS on the Server

To allow cross-origin requests, the server needs to include specific HTTP headers in its response.

**For Example (in Node.js with Express):**

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from another domain!' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

The Cors middleware adds the necessary headers:

- **Access-Control-Allow-Origin**: Specifies which origins are allowed. E.g. (all origins) or http://mywebsite.com.

### Response Headers (Sent by the Server)

Here are common CORS headers included in server responses:

- **Access-Control-Allow-Origin**: Specifies which origin(s) can access the resource. E.g., \* or http://example.com.
- **Access-Control-Allow-Methods**: Lists HTTP methods allowed (e.g., GET, POST).
- **Access-Control-Allow-Headers**: Lists custom headers the client can send (e.g., Content-Type, Authorization).


-----


## Parsing the response from the LLM on the Frontend: 
Let’s begin with writing the frontend code.

**Home.tsx**: It allows users to describe their desired website via a textarea. On submission, it validates the input by checking if the trimmed text is non-empty and then navigates to the /builder page with the entered description stored in prompt and passed as state.

### Builder.tsx: Theory
**Initial Setup:**

- The component is loaded and retrieves the prompt from the URL state using useLocation().
- State variables are initialized to track prompt input, steps, files, messages, and loading status.

**Fetch Template and Steps:**

- The init() function sends a request to the backend to fetch a project template based on the prompt.
- The backend returns steps (uiPrompts) and an initial response (prompts), which are processed and stored in the state (steps and llmMessages).

**Processing Steps:**

- For each step in the workflow, the system checks if it's related to creating or modifying files.
- If a file is to be created, it updates the files state with the new files/folders based on the paths and content from the steps.

**File System Mounting:**

- The files state, which holds the file/folder structure, is converted into a mountable format.
- This file structure is mounted into the WebContainer, simulating a project environment.

**UI Interaction:**

- StepsList: Displays the list of steps in the workflow.
- FileExplorer: Allows users to navigate the project's file system.
- TabView: Switches between code and preview views.
- CodeEditor: Lets the user edit selected files.
- PreviewFrame: Displays a live preview of the project.

**User Input:**

- The user can type a new prompt, which is sent to the backend via a chat API to get new steps.
- The response updates the steps and files, and the conversation history (llmMessages) is updated.

**File Editing and Preview:**

- Users can edit selected files in the CodeEditor or view the live preview of the website in the PreviewFrame.

**File and Step Update:**

- As steps progress (e.g., after the user sends a new prompt), the steps state is updated, new files are added to the files state, and the UI reflects these changes.
  



### Builder.tsx Practical

**The first useEffect**: the files structure will look like this in Builder.tsx 
For parsedPath = **["folder", "subfolder", "file.txt"]**
[{

```json
[{
  "name": "folder",
  "type": "folder",
  "path": "/folder",
  "children": [{
    "name": "subfolder",
    "type": "folder",
    "path": "/folder/subfolder",
    "children": [{
      "name": "file.txt",
      "type": "file",
      "path": "/folder/subfolder/file.txt",
      "content": "console.log('Hello World')"
    }]
  }]
}]
```

**The second useEffect**:  Taking the file structure created in first useEffect as input it converts the files structure into a format (mountStructure) that can be **mounted to the WebContainer virtual file system**. 

```json
{
  "folder": {
    "directory": {
      "subfolder": {
        "directory": {
          "file.txt": {
            "file": {
              "contents": "File contents here"
            }
          }
        }
      }
    }
  }
}
```

**The third init() function:** The init function sends a backend request to get steps and sets them as "pending". These steps trigger the first useEffect to generate the files structure.

1. Sends a request to generate a template based on a prompt.
1. Sets up steps for processing tasks.
1. Sends another request for chat-based responses (e.g., from an AI or backend system).
1. Updates state variables like steps and llmMessages with the received data.

### How the Three Work Together

1. **init Function:**
   1. Fetches steps from the backend and sets their status as "pending".
   1. Updates the steps state, triggering the first useEffect.
1. **First useEffect:**
   1. Listens for changes in steps.
   1. Converts the tasks in steps into a nested files structure.
1. **Second useEffect:**
   1. Listens for changes in files.
   1. Converts the files structure into a WebContainer-compatible format (mountStructure) and mounts it to the WebContainer.

### Build.tsx work flow

**init Function**:

- Fetches data → Updates steps → Triggers JSX rendering with updated steps.

**First JSX Render**:

- Displays initial layout → Shows loader → Awaits state updates.

**First useEffect**:

- Triggered when steps is updated by init → Converts steps → Updates files → Re-renders File Explorer and Code Editor.

**Second useEffect**:

- Triggered when files is updated by the first useEffect → Mounts files to webcontainer → Updates Preview Pane.

**JSX re-renders**:

- Reflects updated steps → Displays the hierarchical files structure → Shows the live website based on the mounted file structure.


-----




# Web Containers: [Web containers quickstart](https://webcontainers.io/guides/quickstart). 
Go through this link for Web Containers docs.
Install Web containers API using: ```npm i @webcontainer/api```.

**Mounting the File Structure:** The WebContainer is responsible for mounting the project's file system structure (folders and files) to a virtual environment. This is done via the **webcontainer?.mount(mountStructure)** method, which takes the mountStructure (a nested object representing the file system) and sets it up in the WebContainer.

**Running the Project:** The WebContainer instance executes the project code, setting up a virtual environment where the project can be run in isolation. It allows the project to be compiled and previewed live without relying on an external server.

**Live Preview:** Once the project is mounted, the WebContainer ensures that any code modifications made through the editor are reflected instantly in the live preview shown in the PreviewFrame. This is crucial for providing a real-time development experience, where users can see their changes without needing to refresh the browser or reload the page.

**HTTP Headers:** The Cross-Origin-Embedder-Policy (COEP) and Cross-Origin-Opener-Policy (COOP) headers are used to make your web app more secure and enable advanced browser features like SharedArrayBuffer (for faster performance in web apps). Add them to vite.config.ts

**WebContainer in PreviewFrame.tsx**
The PreviewFrame component is where the WebContainer is initialized and used to provide a live preview of your project.
The PreviewFrame component uses WebContainer to:
- Run the Project: It starts a development server inside the browser to run your code.
- Live Preview: Renders a live, real-time preview of your project in an iframe.
- Immediate Feedback: As you edit the code in the CodeEditor, the changes are reflected in the preview without any manual reloads.

## Web Container usage
1. In Builder.tsx, the useWebContainer custom hook initializes the WebContainer instance.
```javascript
const webcontainer = useWebContainer();
```
3. The first useEffect runs when the steps or files change. It processes the steps and updates the files state. When the files state is updated, the second useEffect runs and mounts the new file system structure into the WebContainer
```javascript
const createMountStructure = (files: FileItem[]): Record<string, any> => {
  const mountStructure: Record<string, any> = {};
  ...
};
```
3. When steps are updated (e.g., creating or modifying files), the files state is updated to reflect the new file structure. This triggers the remounting of the updated structure in the WebContainer.
```javascript
setFiles(originalFiles);
webcontainer?.mount(mountStructure);
```

4. The webcontainer and files states are defined and managed in Builder.tsx. These are passed to PreviewFrame as props when rendering it inside the TabView.
```javascript
<PreviewFrame webContainer={webcontainer} files={files} />
```

5. In the PreviewFrame component, the main function spawns processes using the **webContainer.spawn()** method. This method is used to execute shell commands inside a WebContainer environment. It runs the following two commands:
- **npm install** - This command installs the necessary dependencies listed in the package.json file of the project.
- **npm run dev** - This command starts the development server, typically running the application in development mode.

6. The server-ready event provides the URL where the preview is hosted, which is set in the url state. Once the url is set, PreviewFrame renders an iframe pointing to the live server hosted by the WebContainer.
```javascript
{url && <iframe width={"100%"} height={"100%"} src={url} />}
```

-----

# Output
![image](https://github.com/user-attachments/assets/5084dda7-98e7-4fa1-b188-7f7066cd8850)

## [Project Outcome](https://www.loom.com/share/bae0038fc27f4e229986700a556a7d3c?sid=62d4d364-9904-46cb-bb8d-b5ab0b787f6c)










