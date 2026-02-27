import React from "react";
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
  onClose,
  onContinue,
}) {
  const slideCountInputId = "presentationSlideCount";

  // Translate existing/legacy format names to the updated product labels.
  // This avoids requiring changes in upstream data sources while ensuring the UI copy matches the spec.
  const titleOverrides = {
    "Executive Deck": "Project Solution Framework Deck",
    "Technical Deep Dive": "Architecture & Design Deck",
    "Architecture & Diagrams": "Capability / Demo Deck",
    "Workflow & Process": "End-to-End Deck",
  };

  function getFormatTitle(format) {
    return titleOverrides[format.title] || format.title;
  }

  // Clamp to a safe, reasonable range and keep it integer-only.
  function setSlideCountSafe(next) {
    const asNumber = Number(next);
    if (!Number.isFinite(asNumber)) return;
    const clamped = Math.max(1, Math.min(99, Math.round(asNumber)));
    onSlideCountChange(clamped);
  }

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

            return (
              <button
                key={f.id}
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
            );
          })}
        </div>

        <div className="pfSectionLabel">Customize Slide Count</div>

        <div className="pfBottomBar">
          <label className="pfSlideCountWrap" htmlFor={slideCountInputId}>
            <input
              id={slideCountInputId}
              className="pfSlideCountInput"
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={slideCount}
              onChange={(e) => setSlideCountSafe(e.target.value)}
              aria-label="Slide count"
            />
            <span className="pfSlidesSuffix" aria-hidden="true">
              slides
            </span>
          </label>

          <button
            type="button"
            className="pfContinueBtn"
            onClick={onContinue}
            disabled={!selectedFormatId}
            aria-disabled={!selectedFormatId}
          >
            Continue <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
