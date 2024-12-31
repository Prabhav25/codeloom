import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; //provides the current route's location, useful for accessing state passed via navigation.
import { StepsList } from "../components/StepsList.tsx"; //handles the display of steps in the builder workflow.
import { FileExplorer } from "../components/FileExplorer.tsx"; //visualizes and navigates file/folder structures.
import { TabView } from "../components/TabView.tsx"; //toggles between code and preview views.
import { CodeEditor } from "../components/CodeEditor.tsx"; //provides an interface for editing selected files.
import { PreviewFrame } from "../components/PreviewFrame.tsx"; //The PreviewFrame component sets up the WebContainer, runs the project, and renders the live preview in an iframe once the development server is ready.
import { Step, FileItem, StepType } from "../types";
import axios from "axios"; //to make HTTP requests from the browser or Node.js
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps"; //Utility function to parse XML into usable data.
import { useWebContainer } from "../hooks/useWebContainer.ts"; //Custom hook managing WebContainer instance.
// import { FileNode } from "@webcontainer/api";
import { Loader } from "../components/Loader.tsx"; //loader spinner

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string }; //Retrieves the prompt string passed via navigation state.
  const [userPrompt, setPrompt] = useState(""); //userPrompt is the user input for interacting with the assistant.
  const [llmMessages, setLlmMessages] = useState<
    //Array storing messages exchanged with the backend or LLM
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false); //loading state tracks whether an operation (e.g., API call) is in progress
  const [templateSet, setTemplateSet] = useState(false); //tracks whether the template is initialized.
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1); // Index of the current step in the workflow.
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code"); //Toggles between "code" and "preview".
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null); //Stores the currently selected file for editing or previewing. selectedFile will hold a file or folder in the file system with properties like name, type (file or folder), path, content etc.

  const [steps, setSteps] = useState<Step[]>([]); //state holds the steps involved in a project-building workflow like building a project, setting configurations, or completing tasks.

  const [files, setFiles] = useState<FileItem[]>([]); //state stores files or folders to manage a list of files or folders in the project’s file system, tracking both files and directories.

  useEffect(() => {
    let originalFiles = [...files]; //a copy of the current files state is created as files is likely an array, and directly modifying it can cause issues
    let updateHappened = false; //a flag that will track whether any changes occurred in the files.
    steps //steps is an array of steps that describe tasks or operations
      .filter(({ status }) => status === "pending") // The filter method is used to create a new array that includes only the steps where the status is "pending" and the the code will only process steps that are still waiting to be completed.
      .map((step) => {
        //map is used to iterate over each "pending" step in the filtered array
        updateHappened = true; //If any step is processed, the updateHappened flag is set to true
        if (step?.type === StepType.CreateFile) {
          // If the step is a "CreateFile" type, it proceeds with the file creation logic inside the block.
          let parsedPath = step.path?.split("/") ?? []; // It splits the path of the file (e.g., "folder/subfolder/file.txt") into an array of strings  ["folder", "subfolder", "file.txt"] If step.path is null or undefined, it falls back to an empty array.
          let currentFileStructure = [...originalFiles]; // A copy of the originalFiles is made and assigned to currentFileStructure. This will allow changes to the file structure without directly modifying the state
          let finalAnswerRef = currentFileStructure; //finalAnswerRef is a reference to the file structure that will be updated.

          let currentFolder = ""; // It will track the current folder as we traverse through the parsedPath
          while (parsedPath.length) {
            //The while loop will continue running as long as there are items in parsedPath, meaning it will process each part of the file path one by one (e.g., "folder", "subfolder", etc.)
            currentFolder = `${currentFolder}/${parsedPath[0]}`; //The currentFolder is updated by appending the first item in parsedPath to it. For example, if currentFolder is "/folder" and parsedPath[0] is "subfolder", it becomes "/folder/subfolder".
            let currentFolderName = parsedPath[0]; //The name of the current folder is stored in currentFolderName means here "folder"
            parsedPath = parsedPath.slice(1); //This line modifies parsedPath by removing the first element. The slice(1) method creates a new array, starting from the second element (index 1), and reassigns it to parsedPath. This is essentially "moving on" to the next folder or file in the path. If parsedPath = ["folder", "subfolder", "file.txt"] then after this comand parsedPath will become ["subfolder", "file.txt"]

            if (!parsedPath.length) {
              // parsedPath is now empty, it means the code has reached the last item in the path (the file)
              // final file
              let file = currentFileStructure.find(
                //The code searches the current file structure to see if a file or folder with the current path (currentFolder) already exists.
                (x) => x.path === currentFolder
              );
              if (!file) {
                //If no file exists at the current folder path, a new file object is added to currentFileStructure
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code; //If the file already exists, its content is updated to step.code
              }
            } else {
              //If parsedPath still has more items, the code checks if a folder exists at currentFolder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                //If not, it adds a new folder object with the name currentFolderName, type "folder", and an empty children array to hold any subfolders or files inside it.

                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                //The currentFileStructure reference is updated to point to the children array of the folder allowing the loop to drill deeper into the folder structure for the next folder or file
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef; //After processing the path, originalFiles is updated to reflect the final structure of the files, including any changes made by the loop
        }
      });

    if (updateHappened) {
      //After processing all steps, the code checks if any updates happened
      setFiles(originalFiles); //If updates occurred, the state of files is updated to originalFiles, which now contains the modified file structure.
      setSteps(
        (
          steps //The steps state is updated to mark all steps as "completed", meaning that all pending steps have been processed.
        ) =>
          steps.map((s: Step) => {
            return {
              ...s,
              status: "completed",
            };
          })
      );
    }
    console.log(files);
  }, [steps, files]); //The code inside will run every time steps or files change. So, whenever the steps change (e.g., new steps are added or existing ones are updated), this logic will be triggered again to modify the files state.

  //The second useEffect is used to convert the files structure (a nested array of files and folders) into a mountable object (mountStructure) and then mount it to the webcontainer
  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      //This defines a function createMountStructure that takes files (an array of FileItem) as an argument. The function will return a Record<string, any>, which is an object where keys are strings, and the values can be any type.
      const mountStructure: Record<string, any> = {}; //Inside createMountStructure, we initialize an empty object mountStructure which will store the directory structure.

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        //processFile is a recursive function that processes each file and folder where file is the current file or folder to be processed and isRootFolder is a boolean indicating whether the file is in the root folder.
        if (file.type === "folder") {
          mountStructure[file.name] = {
            //f the file is a folder, we add an entry to mountStructure with the folder's name (file.name).
            directory: file.children //We check if the folder has any children.
              ? Object.fromEntries(
                  //If it does we use Object.fromEntries to create a new object for the folder's children
                  file.children.map((child) => [
                    //map is used to process each child file/folder, calling processFile(child, false) to process each child and add it to the mountStructure
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {}, //If the folder has no children, we set an empty object ({}).
          };
        } else if (file.type === "file") {
          //If the file is not a folder but a regular file
          if (isRootFolder) {
            //If the file is in the root folder (isRootFolder === true), we create an entry in mountStructure with the file's name and its contents.
            mountStructure[file.name] = {
              file: {
                contents: file.content || "", //The contents of the file are taken from file.content, defaulting to an empty string if no content is provided.
              },
            };
          } else {
            // If the file is not in the root folder (i.e., it's in a subfolder), we return the file object with its contents but do not add it to mountStructure directly. This is because subfiles are handled when their parent folder is processed.
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name]; //For both files and folders, we return the entry for that file/folder in the mountStructure
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure; //After processing all the files and folders, we return the mountStructure, which now contains a nested object representing the file structure.
    };

    const mountStructure = createMountStructure(files); //Here, we call the createMountStructure function with the files state to generate the mount structure.

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure); //If webcontainer is available, we use its mount method to mount the mountStructure
  }, [files, webcontainer]); //The useEffect hook runs again whenever files or webcontainer changes. So, if either of these states change, the file system structure will be recreated, logged, and mounted again.

  //The init function sends a backend request to get steps and sets them as "pending". These steps trigger the first useEffect to generate the files structure.
  async function init() {
    //First API request
    const response = await axios.post(`${BACKEND_URL}/template`, {
      //Sends a POST request to the backend (/template endpoint) with a trimmed version of the prompt as the request payload where the backend processes the prompt and returns templates
      prompt: prompt.trim(),
    });
    setTemplateSet(true); //it indicates that a template has been successfully generated or fetched

    const { prompts, uiPrompts } = response.data; //Extracts prompts and uiPrompts from the API response. These are arrays of data needed for further steps

    setSteps(
      //Parses the first uiPrompt using a parseXml function. Maps the parsed steps (Step objects) into a new format where each step has a status of "pending".
      //If uiPrompts[0] contains: <Step><Task>Create file</Task></Step> then parseXml might convert it into: [{ task: "Create file" }].
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending", //Adding status: "pending" results in: [{ task: "Create file", status: "pending" }]
      }))
    );

    setLoading(true); //to indicate a process (like an API call) is happening
    //Second API request. Sends another POST request to the /chat endpoint with a payload of messages.
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        //combines prompts and the prompt into a single array, mapping each to an object with: role: "user" (indicating the message is from the user) and content: <message content> (the actual prompt content).
        role: "user",
        content,
      })),
    });

    setLoading(false); //Updates loading to false, signaling that the request has completed

    setSteps((s) => [
      //Appends new steps to the existing steps state, parses the response from the API (stepsResponse.data.response), maps each parsed step to include status: "pending".
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        //Combines prompts and the prompt into a single array.
        // role: "user", content: <prompt content> }
        role: "user",
        content,
      }))
    );

    setLlmMessages((x) => [
      //Appends the assistant's response (stepsResponse.data.response) to the llmMessages state.
      ...x,
      { role: "assistant", content: stepsResponse.data.response },
    ]);
    //If the assistant's response is: "<Step><Task>Deploy application</Task></Step>" then The updated llmMessages might look like:
    // [
    //   { role: "user", content: "Prompt 1" },
    //   { role: "user", content: "Prompt 2" },
    //   { role: "assistant", content: "<Step><Task>Deploy application</Task></Step>" }
    // ]
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps} //the list of steps.
                  currentStep={currentStep} //The currently active step
                  onStepClick={setCurrentStep} //The onStepClick function in the Builder component is passed as a prop to StepsList which updates the currentStep when a user clicks on a step, causing the list to re-render with the updated active step.
                />
              </div>
              <div>
                <div className="flex">
                  <br />
                  {/* Displays a loader (Loader) when data is loading */}
                  {(loading || !templateSet) && <Loader />}{" "}
                  {/* Otherwise, shows a text area for the user to input a prompt. */}
                  {!(loading || !templateSet) && (
                    <div className="flex">
                      <textarea
                        value={userPrompt} //Binds the text area to userPrompt state.
                        onChange={(e) => {
                          //Updates userPrompt when the user types.
                          setPrompt(e.target.value);
                        }}
                        className="p-2 w-full"
                      ></textarea>
                      {/* Button Triggers an API request when clicked. Sends the user’s prompt and current llmMessages to the backend. */}
                      <button
                        onClick={async () => {
                          const newMessage = {
                            //Adds the user’s prompt (newMessage) to the messages sent to the server.
                            role: "user" as "user",
                            content: userPrompt,
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(
                            //Calls the backend to generate a response (stepsResponse).
                            `${BACKEND_URL}/chat`,
                            {
                              messages: [...llmMessages, newMessage],
                            }
                          );
                          setLoading(false);

                          setLlmMessages((x) => [...x, newMessage]); //Adds the user’s message and the assistant’s response.
                          setLlmMessages((x) => [
                            ...x,
                            {
                              role: "assistant",
                              content: stepsResponse.data.response,
                            },
                          ]);

                          setSteps((s) => [
                            //Adds new steps parsed from the backend response.
                            ...s,
                            ...parseXml(stepsResponse.data.response).map(
                              (x) => ({
                                ...x,
                                status: "pending" as "pending",
                              })
                            ),
                          ]);
                        }}
                        className="bg-purple-400 px-4"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            {/* FileExplorer a child component that: displays the hierarchical files
            structure and updates selectedFile when a file is clicked. */}
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {
                activeTab === "code" ? (
                  <CodeEditor file={selectedFile} /> //Shows the contents of selectedFile for editing.
                ) : webcontainer ? (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                ) : (
                  <div>Loading...</div>
                ) // Renders a live preview of the website using
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
