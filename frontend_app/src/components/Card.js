import React from "react";
import "../App.css";

/**
 * Generic card container used to structure sections inside screens.
 */

// PUBLIC_INTERFACE
export default function Card({ title, icon, children, ariaLabel, className = "" }) {
  return (
    <section className={["udcCard", className].join(" ").trim()} aria-label={ariaLabel}>
      <div className="udcCardTitleRow">
        <span className="udcCardTitleIcon" aria-hidden="true">
          {icon}
        </span>
        <div className="udcCardTitle">{title}</div>
      </div>
      {children}
    </section>
  );
}
