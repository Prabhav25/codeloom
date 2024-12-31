import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

export function useWebContainer() {
  // custom React hook named useWebContainer that can use React's built-in hooks (like useState or useEffect) to encapsulate logic and state that can be reused across components
  const [webcontainer, setWebcontainer] = useState<WebContainer>(); //The initial value of webcontainer is undefined (since no value is passed to useState).

  async function main() {
    const webcontainerInstance = await WebContainer.boot(); //WebContainer.boot() boots up an instance of WebContainer
    setWebcontainer(webcontainerInstance); //Once the webcontainerInstance is created, the setWebcontainer function is called to update the webcontainer state with the newly created instance
  }
  useEffect(() => {
    main();
  }, []); //The empty array as the second argument ensures that the main function is only called once when the component mounts

  return webcontainer;
}
