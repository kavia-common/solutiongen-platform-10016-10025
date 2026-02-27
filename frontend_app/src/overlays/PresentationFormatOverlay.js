import React, { useMemo } from "react";
import "../App.css";
import { CloseXIcon, RowArrowIcon } from "../components/icons";

/**
 * Presentation format selection overlay.
 * Per assets/presentation_format_overlay_design_notes.md.
 */

// PUBLIC_INTERFACE
export default function PresentationFormatOverlay({
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
  const slideCountInputId = "presentationSlideCount";
  const otherInputId = "presentationFormatOther";

  // Translate existing/legacy format names to the updated product labels.
  // This avoids requiring changes in upstream data sources while ensuring the UI copy matches the spec.
  const titleOverrides = {
    "Executive Deck": "Project Solution Framework",
    "Technical Deep Dive": "Architecture & Design",
    "Technical Deep-Dive": "Architecture & Design",
    "Architecture & Diagrams": "Capability / Demo",
    "Workflow & Process": "End-to-End",
  };

  function getFormatTitle(format) {
    return titleOverrides[format.title] || format.title;
  }

  const selectedFormatTitle = useMemo(() => {
    const found = formats.find((f) => f.id === selectedFormatId);
    return found ? getFormatTitle(found) : null;
  }, [formats, selectedFormatId]);

  const isEndToEndSelected = selectedFormatTitle === "End-to-End";

  // Slide count (for this control) is constrained between 0 and 25, integer-only.
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

  // Slide count stepper is only enabled when the user provides a custom "Other" format.
  // Keep existing clamping/validation behavior once enabled.
  const isOtherTextPresent = (otherText || "").trim().length > 0;
  const slideCountEnabled = isEndToEndSelected && isOtherTextPresent;

  const canContinue = Boolean(selectedFormatId) && (!isEndToEndSelected || slideCountIsValid);

  return (
    <div
      className="pfOverlayScrim"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation Format"
      onMouseDown={(e) => {
        // Clicking the scrim closes (common modal behavior). Only close when
        // the user clicks the scrim itself, not inside the modal content.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pfModal" role="document">
        <div className="pfHeader">
          <div className="pfHeaderText">
            <div className="pfTitle">Presentation Format</div>
            <div className="pfSubtitle">Choose the type of presentation that best fits your needs</div>
          </div>

          <button type="button" className="pfCloseBtn" onClick={onClose} aria-label="Close">
            <CloseXIcon />
          </button>
        </div>

        <div className="pfOptions" role="list" aria-label="Presentation format options">
          {formats.map((f) => {
            const isSelected = f.id === selectedFormatId;
            const isEndToEnd = getFormatTitle(f) === "End-to-End";

            return (
              <div key={f.id} className="pfOptionGroup" role="listitem">
                <button
                  type="button"
                  className={["pfOptionRow", isSelected ? "isSelected" : ""].join(" ").trim()}
                  onClick={() => onSelectFormat(f.id)}
                  aria-pressed={isSelected}
                >
                  <div className="pfOptionText">
                    <div className="pfOptionTitle">{getFormatTitle(f)}</div>
                    <div className="pfOptionDesc">{f.description}</div>
                  </div>

                  <span className="pfOptionAction" aria-hidden="true">
                    <RowArrowIcon />
                  </span>
                </button>

                {isEndToEnd ? (
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
                          placeholder="Type a custom presentation type"
                          onChange={(e) => onOtherTextChange(e.target.value)}
                        />
                      </div>

                      <div className="pfOtherCol pfOtherCol--slideCount">
                        <label className="pfOtherLabel" htmlFor={slideCountInputId}>
                          Slide Count
                        </label>

                        <div
                          className="pfSlideStepper"
                          role="group"
                          aria-label="Slide count (0 to 25)"
                        >
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
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="pfBottomBar">
          <button
            type="button"
            className="pfContinueBtn"
            onClick={onContinue}
            disabled={!canContinue}
            aria-disabled={!canContinue}
            title={!canContinue ? "Select a format and ensure slide count is between 0 and 25." : undefined}
          >
            Continue <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
