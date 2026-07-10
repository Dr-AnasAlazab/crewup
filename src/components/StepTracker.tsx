/** @format */

interface Step {
  number: number;
  label: string;
}

const steps: Step[] = [
  { number: 1, label: "Project Details" },
  { number: 2, label: "Scope & Budget" },
  { number: 3, label: "Review & Publish" },
];

interface StepTrackerProps {
  currentStep: number;
}

export default function StepTracker({ currentStep }: StepTrackerProps) {
  return (
    <div className="flex items-start justify-center gap-0 mb-8">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-start">
            {/* Step node */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex items-center mt-4 mx-2 w-32 xl:w-48">
                <div
                  className={`h-0.5 w-full ${
                    isCompleted ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
