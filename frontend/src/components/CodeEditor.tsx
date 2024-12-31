// It renders the Monaco Code Editor inside a container. If no file is passed to it (file is null), a prompt is displayed asking the user to select a file. Once a file is passed to it, the Monaco Editor is initialized with the file's content, and various customization options like read-only mode and syntax highlighting are applied.
//File Display: When the user selects a file from the file explorer, the selectedFile state is updated, which is passed to the CodeEditor component.
// Read-Only Mode: Since the editor is set to readOnly, users can only view the file content and not edit it. This is useful when you want to display files to the user without allowing modifications.

import Editor from "@monaco-editor/react";
import { FileItem } from "../types";

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme="vs-dark"
      value={file.content || ""}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}
