import React, { useMemo } from "react";
import "../App.css";
import { CloseXIcon } from "../components/icons";

/**
 * Document format selection overlay.
 * Mirrors the Presentation format overlay interaction patterns:
 * - Option list in a modal overlay
 * - Includes an "Other" free-text field
 * - Includes a slide count stepper (enabled only when Other has non-empty text)
 */

// PUBLIC_INTERFACE
export default function DocumentFormatOverlay({
  formats,
  selectedFormatId,
  slideCount,
  onSlideCountChange,
  onSelectFormat,
  otherText,
  onOtherTextChange,
  onClose,
  onContinue,
}) {
  const slideCountInputId = "documentSlideCount";
  const otherInputId = "documentFormatOther";

  // Slide count is constrained between 0 and 25, integer-only (same as presentation overlay).
  function clampSlideCount(next) {
    const asNumber = Number(next);
    if (!Number.isFinite(asNumber)) return null;
    return Math.max(0, Math.min(25, Math.round(asNumber)));
  }

  function setSlideCountSafe(next) {
    const clamped = clampSlideCount(next);
    if (clamped === null) return;
    onSlideCountChange(clamped);
  }

  function increment() {
    setSlideCountSafe((Number(slideCount) || 0) + 1);
  }

  function decrement() {
    setSlideCountSafe((Number(slideCount) || 0) - 1);
  }

  const slideCountIsValid = useMemo(() => {
    const n = Number(slideCount);
    return Number.isInteger(n) && n >= 0 && n <= 25;
  }, [slideCount]);

  const isOtherTextPresent = (otherText || "").trim().length > 0;
  const slideCountEnabled = isOtherTextPresent;

  // Allow continue if:
  // - a preset is selected OR Other is present
  // - and if Other is present, slideCount must be valid
  const canContinue = (Boolean(selectedFormatId) || isOtherTextPresent) && (!isOtherTextPresent || slideCountIsValid);

  return (
    <div
      className="pfOverlayScrim"
      role="dialog"
      aria-modal="true"
      aria-label="Document Format"
      onMouseDown={(e) => {
        // Close when clicking the scrim itself (not the modal content).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pfModal" role="document">
        <div className="pfHeader">
          <div className="pfHeaderText">
            <div className="pfTitle">Document Format</div>
            <div className="pfSubtitle">Choose the type of document you want to generate</div>
          </div>

          <button type="button" className="pfCloseBtn" onClick={onClose} aria-label="Close">
            <CloseXIcon />
          </button>
        </div>

        <div className="pfOptions" role="list" aria-label="Document format options">
          {formats.map((f) => {
            const isSelected = f.id === selectedFormatId;

            return (
              <div key={f.id} className="pfOptionGroup" role="listitem">
                <button
                  type="button"
                  className={["pfOptionRow", isSelected ? "isSelected" : ""].join(" ").trim()}
                  onClick={() => {
                    // Selecting a preset clears "Other" and slide count (slide count is only meaningful for Other mode).
                    onSelectFormat(f.id);
                    if ((otherText || "").trim().length > 0) onOtherTextChange("");
                    if (Number(slideCount) !== 0) onSlideCountChange(0);
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="pfOptionText">
                    <div className="pfOptionTitle">{f.title}</div>
                    <div className="pfOptionDesc">{f.description}</div>
                  </div>

                  <span className="pfOptionAction" aria-hidden="true">
                    ✓
                  </span>
                </button>
              </div>
            );
          })}

          {/* "Other" option block (explicit option, as requested) */}
          <div className="pfOptionGroup" role="listitem">
            <div className="pfOtherWrap">
              <div className="pfOtherRow">
                <div className="pfOtherCol">
                  <label className="pfOtherLabel" htmlFor={otherInputId}>
                    Other
                  </label>
                  <input
                    id={otherInputId}
                    className="pfOtherInput"
                    type="text"
                    value={otherText}
                    placeholder="Type a custom document type"
                    onChange={(e) => {
                      const nextText = e.target.value;
                      const nextPresent = (nextText || "").trim().length > 0;

                      // Typing a non-empty Other clears any preset selection.
                      if (nextPresent && selectedFormatId) onSelectFormat(null);

                      // If the user clears Other, reset slide count to 0.
                      if (!nextPresent && Number(slideCount) !== 0) onSlideCountChange(0);

                      onOtherTextChange(nextText);
                    }}
                  />
                </div>

                <div className="pfOtherCol pfOtherCol--slideCount">
                  <label className="pfOtherLabel" htmlFor={slideCountInputId}>
                    Slide Count
                  </label>

                  <div className="pfSlideStepper" role="group" aria-label="Slide count (0 to 25)">
                    <button
                      type="button"
                      className="pfStepBtn"
                      onClick={decrement}
                      disabled={!slideCountEnabled || !slideCountIsValid || Number(slideCount) <= 0}
                      aria-label="Decrease slide count"
                    >
                      −
                    </button>

                    <input
                      id={slideCountInputId}
                      className={["pfStepInput", !slideCountIsValid ? "isError" : ""].join(" ").trim()}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={25}
                      value={slideCount}
                      onChange={(e) => setSlideCountSafe(e.target.value)}
                      aria-invalid={!slideCountIsValid}
                      disabled={!slideCountEnabled}
                    />

                    <button
                      type="button"
                      className="pfStepBtn"
                      onClick={increment}
                      disabled={!slideCountEnabled || !slideCountIsValid || Number(slideCount) >= 25}
                      aria-label="Increase slide count"
                    >
                      +
                    </button>
                  </div>

                  {!slideCountIsValid ? (
                    <div className="pfInlineError" role="alert">
                      Slide count must be between 0 and 25.
                    </div>
                  ) : (
                    <div className="pfInlineErrorSpacer" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pfBottomBar">
          <button
            type="button"
            className="pfContinueBtn"
            onClick={onContinue}
            disabled={!canContinue}
            aria-disabled={!canContinue}
            title={!canContinue ? "Select a format or enter Other; slide count must be between 0 and 25." : undefined}
          >
            Continue <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
