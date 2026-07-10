/** @format */

import { HelpCircle, Lock } from "lucide-react";

const sidebarSteps = [
  {
    number: 1,
    label: "Project Details",
    description: "Tell us the basics about your project.",
    active: true,
  },
  {
    number: 2,
    label: "Scope & Budget",
    description: "Add scope of work and budget details.",
    active: false,
  },
  {
    number: 3,
    label: "Review & Publish",
    description: "Review your project and publish.",
    active: false,
  },
];

interface SidebarCardsProps {
  currentStep?: number;
}

export default function SidebarCards({ currentStep = 1 }: SidebarCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Project Posting Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-5">
          Project Posting Steps
        </h3>
        <div className="flex flex-col gap-0">
          {sidebarSteps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isLast = index === sidebarSteps.length - 1;

            return (
              <div key={step.number} className="flex gap-4">
                {/* Left — number + vertical line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {step.number}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 min-h-[28px] ${
                        isCompleted ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>

                {/* Right — text */}
                <div className={`pb-5 ${isLast ? "" : ""}`}>
                  <p
                    className={`text-sm font-bold leading-tight ${
                      isActive ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Need Help? */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-6">
        <div className="flex gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-white border border-blue-200 flex items-center justify-center flex-shrink-0">
            <HelpCircle size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Need Help?</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Our team is here to help you find the right contractors for your
              project.
            </p>
          </div>
        </div>
        <button className="w-full mt-1 py-2 px-4 bg-white border border-blue-300 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
          Contact Support
        </button>
      </div>

      {/* Your Information is Secure */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Lock size={16} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Your Information is Secure
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We take data privacy seriously. Your project details are
              confidential and only shared with relevant subcontractors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
