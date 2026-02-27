import React from "react";
import "../App.css";
import { LightningBoltIcon } from "./icons";

/**
 * Top header bar used across screens.
 * Per assets/header_title_subtitle_design_notes.md.
 */

// PUBLIC_INTERFACE
export default function HeaderBar() {
  return (
    <header className="udcHeader" aria-label="Top navigation">
      <div className="udcHeaderInner">
        {/* Left: icon + title + subtitle, per header_title_subtitle_design_notes.md */}
        <div className="udcHeaderContent" aria-label="Demo on Demand header">
          <div className="udcHeaderIcon" aria-hidden="true">
            <LightningBoltIcon />
          </div>
          <div className="udcHeaderText">
            <div className="udcHeaderTitle">Demo on Demand</div>
            <div className="udcHeaderSubtitle">Documents, decks, and demos — powered by AI</div>
          </div>
        </div>
        {/* Navigation tabs and Preview button intentionally removed per spec */}
      </div>
    </header>
  );
}
