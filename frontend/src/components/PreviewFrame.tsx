//The PreviewFrame component sets up a web container environment, installs the necessary dependencies, starts a development server, and displays a preview of the project in an iframe.
//Steps:
//It installs dependencies using npm install.
//It starts the development server with npm run dev.
//It listens for the server-ready event, and once the server is up, it updates the URL.
//It renders a loading state until the URL is set, after which it shows the preview using an iframe.

import { WebContainer } from "@webcontainer/api"; //WebContainer is an API provided by a service (such as WebContainers by StackBlitz) that allows you to run code and create environments directly in the browser. This can be used to run Node.js projects or code in a containerized environment within the browser.
import { useEffect, useState } from "react";

interface PreviewFrameProps {
  files: any[]; //This is an array (currently typed as any[], meaning any type of files), which may contain the files related to the preview.
  webContainer: WebContainer;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState(""); //store the URL of the preview once the server is set up and running

  async function main() {
    // asynchronous function that runs the necessary commands to set up the web container and start the project.
    const installProcess = await webContainer.spawn("npm", ["install"]); //spawn("npm", ["install"]) runs npm install within the container. It installs all dependencies for the project.

    installProcess.output.pipeTo(
      //The output from the npm install command is piped to a WritableStream, where it’s logged to the console. This allows you to see the progress or any logs from the installation process.
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    await webContainer.spawn("npm", ["run", "dev"]); //After the installation is complete, this command runs npm run dev, which starts the development server

    // Wait for `server-ready` event
    webContainer.on("server-ready", (port, url) => {
      //Once the server is ready and running, the webContainer emits a server-ready event. The callback receives port and url as parameters. This is the URL that will be used to display the preview of the project in the iframe
      // ...
      console.log(url);
      console.log(port);
      setUrl(url); //setUrl function updates the url state with the URL of the server.
    });
  }

  useEffect(() => {
    main(); //The main function is called once when the component mounts. The empty dependency array ([]) ensures that the effect runs only once (similar to componentDidMount in class components)
  }, []);
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}
