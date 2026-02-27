import React, { useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * Screen 1: Upload Documents & Configure
 * Implements the UI from assets/upload_documents_configure_design_notes.md.
 */

// PUBLIC_INTERFACE
function App() {
  /** Selected output types (multi-select). No default selection. */
  const [outputTypes, setOutputTypes] = useState([]);
  /** Access key id input (credential). */
  const [accessKeyId, setAccessKeyId] = useState("");
  /** Secret access key input (credential). */
  const [secretAccessKey, setSecretAccessKey] = useState("");
  /** Whether the Access Key ID is visible (unmasked). */
  const [showAccessKeyId, setShowAccessKeyId] = useState(false);
  /** Whether the Secret Access Key is visible (unmasked). */
  const [showSecretAccessKey, setShowSecretAccessKey] = useState(false);

  /** User organization selection (radio). */
  const [userOrganization, setUserOrganization] = useState("");
  /** Business unit selection, only applicable when Tata Elxsi is selected. */
  const [businessUnit, setBusinessUnit] = useState("");

  /** User role selection (dropdown). */
  const [userRole, setUserRole] = useState("");
  /** Purpose selection (dropdown). */
  const [purpose, setPurpose] = useState("");

  /** Client name input. */
  const [companyName, setCompanyName] = useState("");
  /** Tagline input (optional). */
  const [tagline, setTagline] = useState("");
  /** Uploaded file list (documents). */
  const [files, setFiles] = useState([]);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const canContinue = useMemo(() => {
    return files.length > 0 && companyName.trim().length > 0 && outputTypes.length > 0;
  }, [files.length, companyName, outputTypes.length]);

  const outputOptions = useMemo(
    () => [
      {
        id: "summary",
        title: "Document",
        description: "Technical docs, reports and summary",
        icon: <DocumentTileIcon />,
      },
      {
        id: "presentation",
        title: "Presentation",
        description: "Slide decks, pitch materials",
        icon: <PresentationTileIcon />,
      },
      {
        id: "interactive",
        title: "Interactive Demo",
        description: "Live prototype, walkthrough",
        icon: <InteractiveDemoTileIcon />,
      },
    ],
    []
  );

  // PUBLIC_INTERFACE
  function openFilePicker() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // PUBLIC_INTERFACE
  function onFilesSelected(fileList) {
    const incoming = Array.from(fileList || []);

    // Allow the types requested for the dropzone, while keeping existing PDF support.
    // Note: MIME types can be inconsistent across browsers/OSes for Office docs, so we
    // primarily validate by extension as a reliable fallback.
    const allowedExtensions = [".pdf", ".txt", ".doc", ".ppt", ".pptx"];

    const allowed = incoming.filter((f) => {
      const name = (f.name || "").toLowerCase();
      const mime = (f.type || "").toLowerCase();

      const matchesExt = allowedExtensions.some((ext) => name.endsWith(ext));
      const matchesPdfMime = mime === "application/pdf";

      return matchesExt || matchesPdfMime;
    });

    // Keep it simple: append allowed docs, ignore everything else.
    setFiles((prev) => [...prev, ...allowed]);
  }

  // PUBLIC_INTERFACE
  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer?.files?.length) {
      onFilesSelected(e.dataTransfer.files);
    }
  }

  // PUBLIC_INTERFACE
  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  // PUBLIC_INTERFACE
  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  // PUBLIC_INTERFACE
  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // PUBLIC_INTERFACE
  function toggleOutputType(typeId) {
    setOutputTypes((prev) => {
      if (prev.includes(typeId)) return prev.filter((t) => t !== typeId);
      return [...prev, typeId];
    });
  }

  // PUBLIC_INTERFACE
  function onContinue() {
    // No routing in template; keep as a stub action.
    // In later steps, wire to next screen / backend.
    if (!canContinue) return;

    // eslint-disable-next-line no-alert
    alert(
      `Continue\n\nClient: ${companyName}\nOutput: ${outputTypes.join(
        ", "
      )}\nFiles: ${files.length}`
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
                className={["udcDropzone", isDragOver ? "isDragOver" : ""].join(" ")}
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
                <div className="udcDropzonePrimary">Drop files here or click to browse</div>
                <div className="udcDropzoneHelper">
                  Accepted: .pdf, .txt, .doc, .ppt, .pptx
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf,text/plain,.txt,.doc,.ppt,.pptx"
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
            <div className="udcOutputGrid" role="group" aria-label="Choose output types">
              {outputOptions.map((opt) => {
                const selected = outputTypes.includes(opt.id);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={[
                      "udcTile",
                      opt.id === "summary" ? "udcTile--document" : "",
                      opt.id === "presentation" ? "udcTile--presentation" : "",
                      opt.id === "interactive" ? "udcTile--interactive" : "",
                      selected ? "isSelected" : "",
                    ]
                      .join(" ")
                      .trim()}
                    aria-pressed={selected}
                    onClick={() => toggleOutputType(opt.id)}
                  >
                    <div className="udcTileIcon">{opt.icon}</div>
                    <div className="udcTileTitle">{opt.title}</div>
                    <div
                      className={[
                        "udcTileDesc",
                        opt.id === "interactive" ? "udcTileDesc--livePrototype" : "",
                      ]
                        .join(" ")
                        .trim()}
                    >
                      {opt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title="Configuration"
            icon={<ConfigurationHeaderYellowIcon />}
            ariaLabel="Configuration"
          >
            <div className="udcForm">
              <div className="udcFieldRow2Col">
                <div className="udcField">
                  <label className="udcLabel" htmlFor="accessKeyId">
                    Access Key ID
                  </label>
                  <div className="udcInputWithIcon">
                    <input
                      id="accessKeyId"
                      className="udcInput udcInput--withIcon"
                      type={showAccessKeyId ? "text" : "password"}
                      placeholder="Enter access key id"
                      value={accessKeyId}
                      onChange={(e) => setAccessKeyId(e.target.value)}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      className="udcIconBtn"
                      aria-label={showAccessKeyId ? "Hide Access Key ID" : "Show Access Key ID"}
                      aria-pressed={showAccessKeyId}
                      onClick={() => setShowAccessKeyId((v) => !v)}
                    >
                      <EyeIcon visible={showAccessKeyId} />
                    </button>
                  </div>
                </div>

                <div className="udcField">
                  <label className="udcLabel" htmlFor="secretAccessKey">
                    Secret Access Key
                  </label>
                  <div className="udcInputWithIcon">
                    <input
                      id="secretAccessKey"
                      className="udcInput udcInput--withIcon"
                      type={showSecretAccessKey ? "text" : "password"}
                      placeholder="Enter secret access key"
                      value={secretAccessKey}
                      onChange={(e) => setSecretAccessKey(e.target.value)}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      className="udcIconBtn"
                      aria-label={
                        showSecretAccessKey ? "Hide Secret Access Key" : "Show Secret Access Key"
                      }
                      aria-pressed={showSecretAccessKey}
                      onClick={() => setShowSecretAccessKey((v) => !v)}
                    >
                      <EyeIcon visible={showSecretAccessKey} />
                    </button>
                  </div>
                </div>
              </div>

              {/* User Organization (radio) + conditional Business Unit (dropdown)
                  Requirement:
                  - Tata Elxsi and External radios should be inline
                  - When Tata Elxsi is selected, show Business Unit dropdown next to External
                    in the same row under Secret Access Key. */}
              <fieldset className="udcField udcFieldset" aria-label="User organization">
                <legend className="udcLabel">User Organization</legend>

                <div className="udcOrgRow" role="radiogroup" aria-label="User Organization">
                  <label className="udcRadioOption udcOrgRadioOption">
                    <input
                      type="radio"
                      name="userOrganization"
                      value="tata_elxsi"
                      checked={userOrganization === "tata_elxsi"}
                      onChange={() => {
                        setUserOrganization("tata_elxsi");
                        // If user is switching org, keep BU empty to avoid stale selection.
                        setBusinessUnit("");
                      }}
                    />
                    <span className="udcRadioLabelText">Tata Elxsi</span>
                  </label>

                  <label className="udcRadioOption udcOrgRadioOption">
                    <input
                      type="radio"
                      name="userOrganization"
                      value="external"
                      checked={userOrganization === "external"}
                      onChange={() => {
                        setUserOrganization("external");
                        // External users should not carry a stale Business Unit selection.
                        setBusinessUnit("");
                      }}
                    />
                    <span className="udcRadioLabelText">External</span>
                  </label>

                  {userOrganization === "tata_elxsi" ? (
                    <div className="udcOrgBusinessUnit">
                      <label className="udcLabel" htmlFor="businessUnit">
                        Business Unit
                      </label>
                      <select
                        id="businessUnit"
                        className="udcInput"
                        value={businessUnit}
                        onChange={(e) => setBusinessUnit(e.target.value)}
                      >
                        <option value="" disabled>
                          Select business unit
                        </option>
                        <option value="MCVA">MCVA</option>
                        <option value="MCVR">MCVR</option>
                        <option value="ACTG">ACTG</option>
                        <option value="IDV">IDV</option>
                        <option value="HLSBU">HLSBU</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  ) : null}
                </div>
              </fieldset>

              <div className="udcFieldRow2Col">
                <div className="udcField">
                  <label className="udcLabel" htmlFor="userRole">
                    User Role
                  </label>
                  <select
                    id="userRole"
                    className="udcInput"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Select user role
                    </option>
                    <option value="Delivery Manager">Delivery Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="PreSales">PreSales</option>
                    <option value="Director">Director</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="udcField">
                  <label className="udcLabel" htmlFor="purpose">
                    Purpose
                  </label>
                  <select
                    id="purpose"
                    className="udcInput"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  >
                    <option value="" disabled>
                      Select purpose
                    </option>
                    <option value="Sales Pitch">Sales Pitch</option>
                    <option value="Solution Proposal">Solution Proposal</option>
                    <option value="Internal Review">Internal Review</option>
                    <option value="Client Demo">Client Demo</option>
                  </select>
                </div>
              </div>

              {/* Client Name + Tagline in the same responsive row */}
              <div className="udcConfigClientRow">
                <div className="udcField">
                  <label className="udcLabel" htmlFor="companyName">
                    Client Name
                  </label>
                  <input
                    id="companyName"
                    className="udcInput"
                    placeholder="Enter client name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="udcField">
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
              </div>
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

function Card({ title, icon, children, ariaLabel, className = "" }) {
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

function YellowDot() {
  return <span className="udcYellowDot" />;
}

/**
 * Yellow rounded-square icon used in the "Configuration" card header.
 * Matches the existing header icon pattern (yellow tile + dark glyph).
 */
function ConfigurationHeaderYellowIcon() {
  return (
    <span className="udcConfigurationHeaderIcon" aria-hidden="true">
      <svg
        className="udcConfigurationHeaderIconGlyph"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
      >
        {/* Simple gear-like glyph */}
        <path
          d="M12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z"
          stroke="currentColor"
          strokeWidth="2"
        />
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
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
function ChooseOutputTypeHeaderYellowIcon() {
  return (
    <span className="udcChooseOutputHeaderYellowIcon" aria-hidden="true">
      <svg
        className="udcChooseOutputHeaderYellowIconGlyph"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
      >
        {/* Bullet list glyph */}
        <path
          d="M10 8h10M10 12h10M10 16h10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6.5 8h.01M6.5 12h.01M6.5 16h.01"
          stroke="currentColor"
          strokeWidth="4"
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
function EyeIcon({ visible }) {
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
      <path d="M4 5h16v10H4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 15v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 9h4M7 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

/**
 * Output option tile icons: screenshot uses a yellow rounded-square badge
 * with a dark glyph. These icons are self-contained to ensure the styling
 * matches regardless of the parent tile selection state.
 */
function OutputTypeTileBadge({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        background: "#FACC15",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.18) inset",
      }}
    >
      {children}
    </span>
  );
}

function DocumentTileIcon() {
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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        {/* Document glyph should be yellow per screenshot */}
        <rect x="6.5" y="4.5" width="11" height="15" rx="2" stroke="#FACC15" strokeWidth="2" />
        <path d="M9 11h6" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 15h6" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function PresentationTileIcon() {
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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
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

function InteractiveDemoTileIcon() {
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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        {/* Yellow glyph (play-in-a-tile) to match screenshot */}
        <path d="M10.5 7.8 15.8 12l-5.3 4.2V7.8Z" fill="#FACC15" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="2.2" stroke="#FACC15" strokeWidth="2" />
      </svg>
    </span>
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
      <path d="M4 20l10-10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 10l6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
    <svg className="udcHeaderIconBolt" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2L6 13h5l-1 9 7-11h-5l1-9z" />
    </svg>
  );
}

export default App;
