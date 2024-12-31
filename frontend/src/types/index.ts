export enum StepType { //to define the type of actions that can occur in a project-building workflow.
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}

export interface Step {
  //Represents a single step in the project-building workflow
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: "pending" | "in-progress" | "completed";
  code?: string;
  path?: string;
}

export interface Project {
  prompt: string;
  steps: Step[];
}

export interface FileItem {
  //Represents a file or folder in the project’s file system
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  //Props for a file viewer component, which displays the content of a file.

  file: FileItem | null;
  onClose: () => void;
}
