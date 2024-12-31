//displays a list of steps
//When a step is clicked in StepsList, the onStepClick function is called with the id of the clicked step. This updates the currentStep state in Builder.tsx, which re-renders the StepsList to highlight the clicked step as active.
import { CheckCircle, Circle, Clock } from "lucide-react";
import { Step } from "../types";

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Build Steps</h2>
      <div className="space-y-4">
        {steps.map(
          //steps.map() function is used to iterate over the array of steps and render each one.
          (step) => (
            <div //For each step, a div is created
              key={step.id}
              className={`p-1 rounded-lg cursor-pointer transition-colors ${
                currentStep === step.id
                  ? "bg-gray-800 border border-gray-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => onStepClick(step.id)} //When a user clicks on a step, the onStepClick(step.id) function is called, passing the id of the clicked step
            >
              <div className="flex items-center gap-2">
                {step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" /> //If the status is "completed", the component displays a green check circle
                ) : step.status === "in-progress" ? (
                  <Clock className="w-5 h-5 text-blue-400" /> //If the status is "in-progress", the component displays a blue clock circle (Clock icon).
                ) : (
                  <Circle className="w-5 h-5 text-gray-600" /> //If the status is anything else (assumed to be pending), it displays a gray empty circle (Circle icon).
                )}
                <h3 className="font-medium text-gray-100">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mt-2">{step.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
