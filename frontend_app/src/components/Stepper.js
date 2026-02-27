import React from "react";
import "../App.css";

/**
 * Numbered stepper row above the main heading (e.g., Input/GAP/Review/Generation/Output).
 */

// PUBLIC_INTERFACE
export default function Stepper({ steps, currentStep = 0, ariaLabel }) {
  return (
    <div className="udcStepperWrap" aria-label={ariaLabel}>
      <ol className="udcStepper" role="list">
        {steps.map((label, idx) => {
          const isActive = idx === currentStep;
          const stepNumber = idx + 1;

          return (
            <li key={`${label}-${idx}`} className={["udcStep", isActive ? "isActive" : ""].join(" ").trim()}>
              <span className="udcStepCircle">{stepNumber}</span>
              <span className="udcStepLabel">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
