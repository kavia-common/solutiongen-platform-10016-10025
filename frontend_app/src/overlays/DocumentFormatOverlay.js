import React, { useMemo } from "react";
import "../App.css";
import { CloseXIcon } from "../components/icons";

/**
 * Inline SVG icons for Document formats.
 * Kept inside this overlay file to:
 * - satisfy the "inline SVG" requirement
 * - avoid coupling these one-off glyphs to the global icon set
 *
 * All icons are single-color and inherit currentColor so they match `.pfOptionAction`
 * (yellow tile + dark foreground) and remain consistent with existing overlay styling.
 */

function DocPrimaryIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* document with a small star/badge to imply "primary/master" */}
      <path
        d="M7 3.8h7.7L19 8.1V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14.7 3.8V8a2 2 0 0 0 2 2h2.3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
      <path d="M8.5 15.5h5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
      <path
        d="M9.2 9.2 10 7.8l.8 1.4 1.6.3-1.1 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.1-1.1 1.6-.3Z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}

function DocOverviewIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* document + magnifying glass to imply "overview" / "review" */}
      <path
        d="M7 3.8h7.7L19 8.1V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14.7 3.8V8a2 2 0 0 0 2 2h2.3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12h6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
      <path d="M8.5 15.5h5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

      {/* magnifier */}
      <circle cx="15.6" cy="15.6" r="2.2" stroke="currentColor" strokeWidth="2" />
      <path d="M17.2 17.2l2.0 2.0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DocStatusReportIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* chart in a frame to imply "status/reporting" */}
      <rect x="4.5" y="5" width="15" height="14" rx="2.2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16.8v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16.8v-7.0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
      <path d="M16 16.8v-5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M7.2 17.2h10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function DocSowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* contract-like document with check to imply SOW */}
      <path
        d="M7 3.8h7.7L19 8.1V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14.7 3.8V8a2 2 0 0 0 2 2h2.3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
      <path d="M8.5 15.5h4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path
        d="M9 18.2l1.3 1.3L14.4 15.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getDocFormatRowEndIcon(title) {
  // Map by displayed title.
  const normalized = (title || "").toLowerCase();

  if (normalized.includes("primary")) return <DocPrimaryIcon className="pfPptIcon" />;
  if (normalized.includes("overview")) return <DocOverviewIcon className="pfPptIcon" />;
  if (normalized.includes("status")) return <DocStatusReportIcon className="pfPptIcon" />;
  // Covers: "Statement of Work (SOW)" / "SOW" / "Statement of Work"
  if (normalized.includes("statement of work") || normalized === "sow" || normalized.includes("(sow)")) {
    return <DocSowIcon className="pfPptIcon" />;
  }

  // Fallback: use a neutral doc icon
  return <DocOverviewIcon className="pfPptIcon" />;
}

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
                    {getDocFormatRowEndIcon(f.title)}
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
