import React, { useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * Screen 1: Upload Documents & Configure
 * Implements the UI from assets/upload_documents_configure_design_notes.md.
 */

// PUBLIC_INTERFACE
function App() {
  /** Selected output type (single-select). */
  const [outputType, setOutputType] = useState("summary");
  /** Company name input. */
  const [companyName, setCompanyName] = useState("");
  /** Tagline input (optional). */
  const [tagline, setTagline] = useState("");
  /** Uploaded file list (PDF). */
  const [files, setFiles] = useState([]);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const canContinue = useMemo(() => {
    return files.length > 0 && companyName.trim().length > 0 && !!outputType;
  }, [files.length, companyName, outputType]);

  const outputOptions = useMemo(
    () => [
      {
        id: "summary",
        title: "Document",
        description: "Generate a comprehensive summary",
        icon: <DocIcon />,
      },
      {
        id: "presentation",
        title: "Presentation",
        description: "Create slides-ready key points",
        icon: <SlidesIcon />,
      },
      {
        id: "interactive",
        title: "Interactive Demo",
        description: "Build an interactive experience",
        icon: <SparkIcon />,
      },
    ],
    []
  );

  function openFilePicker() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function onFilesSelected(fileList) {
    const incoming = Array.from(fileList || []);
    const pdfsOnly = incoming.filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf")
    );

    // Keep it simple: append PDFs, ignore non-PDFs.
    setFiles((prev) => [...prev, ...pdfsOnly]);
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer?.files?.length) {
      onFilesSelected(e.dataTransfer.files);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function onContinue() {
    // No routing in template; keep as a stub action.
    // In later steps, wire to next screen / backend.
    if (!canContinue) return;
    // eslint-disable-next-line no-alert
    alert(
      `Continue\n\nCompany: ${companyName}\nOutput: ${outputType}\nFiles: ${files.length}`
    );
  }

  return (
    <div className="udcPage">
      <HeaderBar />

      <main className="udcMain">
        {/* Numbered stepper row above the main heading, matching design */}
        <Stepper
          steps={["Input", "Gap Analysis", "Review", "Generation", "Output"]}
          currentStep={0}
          ariaLabel="Demo on Demand setup steps"
        />

        <section className="udcTitleBlock" aria-label="Page title">
          <h1 className="udcTitle">Upload Documents &amp; Configure</h1>
          <p className="udcSubtitle">
            Start by uploading your own documents and configuring your Demo on
            Demand experience.
          </p>
        </section>

        <section className="udcCards" aria-label="Upload and configuration">
          <Card
            title="Upload Project Documents"
            icon={<UploadCardHeaderYellowIcon />}
            ariaLabel="Upload Project Documents"
          >
            <div className="udcUploadInset">
              <div
                className={[
                  "udcDropzone",
                  isDragOver ? "isDragOver" : "",
                ].join(" ")}
                role="button"
                tabIndex={0}
                aria-label="Drop files here or click to browse"
                onClick={openFilePicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openFilePicker();
                }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
              >
                <UploadIcon />
                <div className="udcDropzonePrimary">
                  Drop files here or click to browse
                </div>
                <div className="udcDropzoneHelper">
                  PDF: Word, Text, Notion, PowerPoint
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  className="udcFileInput"
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
              </div>
            </div>

            {files.length > 0 && (
              <div className="udcFileList" aria-label="Selected files">
                {files.map((f, idx) => (
                  <div className="udcFileRow" key={`${f.name}-${idx}`}>
                    <span className="udcFileName" title={f.name}>
                      {f.name}
                    </span>
                    <button
                      type="button"
                      className="udcFileRemove"
                      onClick={() => removeFile(idx)}
                      aria-label={`Remove ${f.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Choose Output Type"
            icon={<ChooseOutputTypeHeaderYellowIcon />}
            ariaLabel="Choose Output Type"
          >
            <div
              className="udcOutputGrid"
              role="radiogroup"
              aria-label="Choose output type"
            >
              {outputOptions.map((opt) => {
                const selected = opt.id === outputType;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={["udcTile", selected ? "isSelected" : ""].join(
                      " "
                    )}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setOutputType(opt.id)}
                  >
                    <div className="udcTileIcon">{opt.icon}</div>
                    <div className="udcTileTitle">{opt.title}</div>
                    <div className="udcTileDesc">{opt.description}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title="Configuration"
            icon={<YellowDot />}
            ariaLabel="Configuration"
          >
            <div className="udcForm">
              <label className="udcLabel" htmlFor="companyName">
                Company Name
              </label>
              <input
                id="companyName"
                className="udcInput"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <label className="udcLabel" htmlFor="tagline">
                Tagline (optional)
              </label>
              <input
                id="tagline"
                className="udcInput"
                placeholder="Your company tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
          </Card>

          <div className="udcCtaRow">
            <button
              type="button"
              className="udcCtaButton"
              onClick={onContinue}
              disabled={!canContinue}
            >
              Continue to Gap Analysis
              <span className="udcCtaArrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeaderBar() {
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
            <div className="udcHeaderSubtitle">
              Documents, decks, and demos — powered by AI
            </div>
          </div>
        </div>
        {/* Navigation tabs and Preview button intentionally removed per spec */}
      </div>
    </header>
  );
}

function NavPill({ label, icon = null, active = false }) {
  return (
    <button
      type="button"
      className={["udcNavPill", active ? "isActive" : ""].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {icon ? (
        <span className="udcNavIcon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="udcNavLabel">{label}</span>
    </button>
  );
}

function Card({ title, icon, children, ariaLabel }) {
  return (
    <section className="udcCard" aria-label={ariaLabel}>
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

function YellowDot() {
  return <span className="udcYellowDot" />;
}

function UploadCardHeaderIcon() {
  return (
    <svg
      className="udcUploadHeaderIcon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.5 6.5 12 3l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14.5v4A2.5 2.5 0 0 0 7.5 21h9A2.5 2.5 0 0 0 19 18.5v-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadCardHeaderYellowIcon() {
  return (
    <span className="udcUploadHeaderYellowIcon" aria-hidden="true">
      <svg
        className="udcUploadHeaderYellowIconGlyph"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
      >
        <path
          d="M12 16V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8.75 11.25 12 8l3.25 3.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Yellow rounded-square icon used in the "Choose Output Type" card header.
 * Matches the screenshot: small yellow tile with a dark "panel/window" glyph.
 */
function ChooseOutputTypeHeaderYellowIcon() {
  return (
    <span className="udcChooseOutputHeaderYellowIcon" aria-hidden="true">
      <svg
        className="udcChooseOutputHeaderYellowIconGlyph"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
      >
        {/* Outer rounded rectangle (window) */}
        <rect
          x="6.5"
          y="7"
          width="11"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Top bar line */}
        <path
          d="M6.8 10h10.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Stepper({ steps, currentStep = 0, ariaLabel }) {
  return (
    <div className="udcStepperWrap" aria-label={ariaLabel}>
      <ol className="udcStepper" role="list">
        {steps.map((label, idx) => {
          const isActive = idx === currentStep;
          const stepNumber = idx + 1;

          return (
            <li
              key={`${label}-${idx}`}
              className={["udcStep", isActive ? "isActive" : ""].join(" ").trim()}
            >
              <span className="udcStepCircle">{stepNumber}</span>
              <span className="udcStepLabel">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* Simple inline icons (SVG). */
function UploadIcon() {
  return (
    <svg
      className="udcIcon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.95"
      />
      <path
        d="M12 14V9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
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

function ArrowRightIcon() {
  return (
    <svg
      className="udcArrowIcon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4a2 2 0 0 0 2 2h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 13h8M8 17h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlidesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v10H4V5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 19h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 15v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 9h4M7 12h7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 4.8L18 8l-4.8 1.2L12 14l-1.2-4.8L6 8l4.8-1.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.8 3.2L23 17l-3.2.8L19 21l-.8-3.2L15 17l3.2-.8L19 13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 18h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.5 2A3.5 3.5 0 0 0 7 18Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l10-10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14 10l6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M15 3l1 2M19 7l2 1M12 6l2-1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 18l-2 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7l-1 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 12h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8a3 3 0 1 0-2.9-3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 14a3 3 0 1 0 2.9 3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.6 15.3l6.8-3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.6 8.7l6.8 3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

/* Lightning bolt icon for header yellow square */
function LightningBoltIcon() {
  return (
    <svg
      className="udcHeaderIconBolt"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M13 2L6 13h5l-1 9 7-11h-5l1-9z" />
    </svg>
  );
}

export default App;
