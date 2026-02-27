import React from "react";

/* Simple inline icons (SVG). */

// PUBLIC_INTERFACE
export function UploadIcon() {
  return (
    <svg className="udcIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" opacity="0.95" />
      <path d="M12 14V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M9.75 11.25 12 9l2.25 2.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function ArrowRightIcon() {
  return (
    <svg className="udcArrowIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Eye icon used for credential visibility toggles.
 * When visible=false, an eye with a strike-through is shown.
 */
// PUBLIC_INTERFACE
export function EyeIcon({ visible }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        {...common}
        d="M2.5 12s3.6-7 9.5-7 9.5 7 9.5 7-3.6 7-9.5 7-9.5-7-9.5-7Z"
        opacity="0.95"
      />
      <path {...common} d="M12 15.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z" />
      {!visible ? <path {...common} d="M5 19 19 5" /> : null}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function CloseXIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function RowArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Yellow rounded-square icon used in the "Configuration" card header.
 * Matches the existing header icon pattern (yellow tile + dark glyph).
 */
// PUBLIC_INTERFACE
export function ConfigurationHeaderYellowIcon() {
  return (
    <span className="udcConfigurationHeaderIcon" aria-hidden="true">
      <svg className="udcConfigurationHeaderIconGlyph" viewBox="0 0 24 24" fill="none" focusable="false">
        {/* Simple gear-like glyph */}
        <path d="M12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 3.5v2.1M12 18.4v2.1M3.5 12h2.1M18.4 12h2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// PUBLIC_INTERFACE
export function UploadCardHeaderYellowIcon() {
  return (
    <span className="udcUploadHeaderYellowIcon" aria-hidden="true">
      <svg className="udcUploadHeaderYellowIconGlyph" viewBox="0 0 24 24" fill="none" focusable="false">
        {/* Bigger arrow glyph (bold, single-icon) to match the screenshot */}
        <path d="M12 19V7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path
          d="M7.25 11.25 12 6.5l4.75 4.75"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Yellow rounded-square icon used in the "Choose Output Type" card header.
 * Matches the screenshot: larger light-yellow tile with a yellow "list/bullets" glyph.
 */
// PUBLIC_INTERFACE
export function ChooseOutputTypeHeaderYellowIcon() {
  return (
    <span className="udcChooseOutputHeaderYellowIcon" aria-hidden="true">
      <svg className="udcChooseOutputHeaderYellowIconGlyph" viewBox="0 0 24 24" fill="none" focusable="false">
        {/* Bullet list glyph */}
        <path d="M10 8h10M10 12h10M10 16h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6.5 8h.01M6.5 12h.01M6.5 16h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Output option tile icons: screenshot uses a light-yellow rounded-square badge
 * with a yellow glyph. These icons are self-contained to ensure the styling
 * matches regardless of the parent tile selection state.
 */
// PUBLIC_INTERFACE
export function DocumentTileIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        // Light yellow tile per screenshot (lighter than other options)
        background: "rgba(250, 204, 21, 0.22)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 1px rgba(250, 204, 21, 0.20) inset",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
        {/* Document glyph should be yellow per screenshot */}
        <rect x="6.5" y="4.5" width="11" height="15" rx="2" stroke="#FACC15" strokeWidth="2" />
        <path d="M9 11h6" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 15h6" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// PUBLIC_INTERFACE
export function PresentationTileIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        // Light yellow tile behind icon (as in screenshot)
        background: "rgba(250, 204, 21, 0.22)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 1px rgba(250, 204, 21, 0.20) inset",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
        {/* Use yellow glyph (as in screenshot) */}
        <rect x="5.5" y="6.5" width="13" height="9" rx="1.8" stroke="#FACC15" strokeWidth="2" />
        {/* Stand */}
        <path d="M12 15.5v3" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.5 19h5" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        {/* Rising chart line */}
        <path
          d="M8.2 13.2l2.6-2.7 2.2 2.0 2.7-3.2"
          stroke="#FACC15"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// PUBLIC_INTERFACE
export function InteractiveDemoTileIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        // Light yellow tile behind icon (match screenshot + other updated tiles)
        background: "rgba(250, 204, 21, 0.22)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 1px rgba(250, 204, 21, 0.20) inset",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
        {/* Yellow glyph (play-in-a-tile) to match screenshot */}
        <path d="M10.5 7.8 15.8 12l-5.3 4.2V7.8Z" fill="#FACC15" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="2.2" stroke="#FACC15" strokeWidth="2" />
      </svg>
    </span>
  );
}

/* Lightning bolt icon for header yellow square */
// PUBLIC_INTERFACE
export function LightningBoltIcon() {
  return (
    <svg className="udcHeaderIconBolt" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2L6 13h5l-1 9 7-11h-5l1-9z" />
    </svg>
  );
}
