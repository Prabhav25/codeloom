//It allows users to describe their desired website via a textarea. On submission, it validates the input by checking if the trimmed text is non-empty and then navigates to the /builder page with the entered description stored in prompt and passed as state.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; //to navigate between pages in the project.
import { Wand2 } from "lucide-react";
// import axios from "axios";
// import { BACKEND_URL } from "../config";

export function Home() {
  const [prompt, setPrompt] = useState(""); //prompt state which stores the text entered by the user
  const navigate = useNavigate(); //navigate to different routes in the application, here to Builder page when submitted.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      //This condition evaluates whether the trimmed(removes any leading and trailing whitespace characters from the prompt string) prompt is a non-empty string then only navigation occurs.
      navigate("/builder", { state: { prompt } }); //navigating to Builder.tsx and passing prompt as state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wand2 className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Website Builder AI
          </h1>
          <p className="text-lg text-gray-300">
            Describe your dream website, and we'll help you build it step by
            step
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)} //Whenever the user types in the textarea, this updates the prompt state with the current input value (e.target.value).
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-gray-100 py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Generate Website Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
