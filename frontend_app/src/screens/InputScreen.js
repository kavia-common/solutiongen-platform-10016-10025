import React, { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import HeaderBar from "../components/HeaderBar";
import Stepper from "../components/Stepper";
import Card from "../components/Card";
import PresentationFormatOverlay from "../overlays/PresentationFormatOverlay";
import {
  UploadCardHeaderYellowIcon,
  ChooseOutputTypeHeaderYellowIcon,
  ConfigurationHeaderYellowIcon,
  DocumentTileIcon,
  PresentationTileIcon,
  InteractiveDemoTileIcon,
  UploadIcon,
  ArrowRightIcon,
  EyeIcon,
} from "../components/icons";

/**
 * Screen 1: Upload Documents & Configure
 * Implements the UI from assets/upload_documents_configure_design_notes.md.
 */

// PUBLIC_INTERFACE
export default function InputScreen() {
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

  /**
   * Presentation format overlay state (opened when Presentation tile is clicked).
   * Persisted within the screen state (so reopening shows previous selection).
   */
  const [isPresentationFormatOpen, setIsPresentationFormatOpen] = useState(false);
  const [presentationFormat, setPresentationFormat] = useState(null);
  const [presentationSlideCount, setPresentationSlideCount] = useState(7);

  /**
   * Simple validation state for required credentials.
   * We only show errors after the user attempts to continue, or after a field is blurred.
   */
  const [showCredentialValidation, setShowCredentialValidation] = useState(false);
  const [accessKeyIdTouched, setAccessKeyIdTouched] = useState(false);
  const [secretAccessKeyTouched, setSecretAccessKeyTouched] = useState(false);

  /** User organization selection (radio). */
  const [userOrganization, setUserOrganization] = useState("");
  /** Business unit selection, only applicable when Tata Elxsi is selected. */
  const [businessUnit, setBusinessUnit] = useState("");

  /** User role selection (dropdown). */
  const [userRole, setUserRole] = useState("");
  /** Purpose selection (dropdown). */
  const [purpose, setPurpose] = useState("");

  /** Client type selection (radio). */
  const [clientType, setClientType] = useState("");
  /** Client name input. */
  const [companyName, setCompanyName] = useState("");
  /** Tagline input (optional). */
  const [tagline, setTagline] = useState("");
  /** Uploaded file list (documents). */
  const [files, setFiles] = useState([]);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const credentialsValid = useMemo(() => {
    return accessKeyId.trim().length > 0 && secretAccessKey.trim().length > 0;
  }, [accessKeyId, secretAccessKey]);

  const canContinue = useMemo(() => {
    // Requirement: "Continue to Gap Analysis" should be enabled once BOTH
    // Access Key ID and Secret Access Key are entered (non-empty).
    return credentialsValid;
  }, [credentialsValid]);

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

  const presentationFormatOptions = useMemo(
    () => [
      {
        id: "executive_deck",
        title: "Executive Deck",
        description: "High-level overview presentation with decision makers",
      },
      {
        id: "technical_deep_dive",
        title: "Technical Deep-Dive",
        description: "Detailed technical presentation with diagrams and architecture",
      },
      {
        id: "architecture_diagrams",
        title: "Architecture & Diagrams",
        description: "Visual architecture presentation with infrastructure layout",
      },
      {
        id: "workflow_process",
        title: "Workflow & Process",
        description: "Process flow presentation with step-by-step interaction flow",
      },
    ],
    []
  );

  useEffect(() => {
    if (!isPresentationFormatOpen) return;

    // Close on ESC to match common modal interaction patterns.
    function onKeyDown(e) {
      if (e.key === "Escape") setIsPresentationFormatOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPresentationFormatOpen]);

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
  function onOutputTypeClick(typeId) {
    // Ensure that clicking Presentation opens the overlay.
    if (typeId === "presentation") {
      setIsPresentationFormatOpen(true);
    }
    toggleOutputType(typeId);
  }

  // PUBLIC_INTERFACE
  function onContinue() {
    // Show required validation feedback for Access Key ID & Secret Access Key.
    setShowCredentialValidation(true);

    // No routing in template; keep as a stub action.
    // In later steps, wire to next screen / backend.
    if (!canContinue) return;

    // eslint-disable-next-line no-alert
    alert(
      `Continue\n\nClient: ${companyName}\nOutput: ${outputTypes.join(
        ", "
      )}\nPPT Format: ${presentationFormat || "(none)"}\nSlides: ${presentationSlideCount}\nFiles: ${
        files.length
      }`
    );
  }

  // PUBLIC_INTERFACE
  function onPresentationFormatContinue() {
    // Close overlay and keep the selection state persisted in App state.
    // In later steps, this should influence generation parameters.
    if (!presentationFormat) return;
    setIsPresentationFormatOpen(false);
  }

  const accessKeyIdMissing =
    (showCredentialValidation || accessKeyIdTouched) && accessKeyId.trim().length === 0;

  const secretAccessKeyMissing =
    (showCredentialValidation || secretAccessKeyTouched) && secretAccessKey.trim().length === 0;

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
            Start by uploading your own documents and configuring your Demo on Demand experience.
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
                <div className="udcDropzoneHelper">Accepted: .pdf, .txt, .doc, .ppt, .pptx</div>

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
                    onClick={() => onOutputTypeClick(opt.id)}
                  >
                    <div className="udcTileIcon">{opt.icon}</div>
                    <div className="udcTileTitle">{opt.title}</div>
                    <div
                      className={["udcTileDesc", opt.id === "interactive" ? "udcTileDesc--livePrototype" : ""]
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

          <Card title="Configuration" icon={<ConfigurationHeaderYellowIcon />} ariaLabel="Configuration">
            <div className="udcForm">
              <div className="udcFieldRow2Col">
                <div className="udcField">
                  <label className="udcLabel" htmlFor="accessKeyId">
                    Access Key ID <span className="udcRequiredMark">*</span>
                  </label>
                  <div className="udcInputWithIcon">
                    <input
                      id="accessKeyId"
                      className={["udcInput", "udcInput--withIcon", accessKeyIdMissing ? "udcInput--error" : ""]
                        .join(" ")
                        .trim()}
                      type={showAccessKeyId ? "text" : "password"}
                      placeholder="Enter access key id"
                      value={accessKeyId}
                      onChange={(e) => setAccessKeyId(e.target.value)}
                      onBlur={() => setAccessKeyIdTouched(true)}
                      autoComplete="off"
                      spellCheck="false"
                      required
                      aria-invalid={accessKeyIdMissing}
                      aria-describedby="accessKeyIdError"
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

                  {accessKeyIdMissing ? (
                    <div className="udcFieldError" id="accessKeyIdError" role="alert">
                      Access Key ID is required.
                    </div>
                  ) : (
                    <div className="udcFieldErrorSpacer" aria-hidden="true" />
                  )}
                </div>

                <div className="udcField">
                  <label className="udcLabel" htmlFor="secretAccessKey">
                    Secret Access Key <span className="udcRequiredMark">*</span>
                  </label>
                  <div className="udcInputWithIcon">
                    <input
                      id="secretAccessKey"
                      className={["udcInput", "udcInput--withIcon", secretAccessKeyMissing ? "udcInput--error" : ""]
                        .join(" ")
                        .trim()}
                      type={showSecretAccessKey ? "text" : "password"}
                      placeholder="Enter secret access key"
                      value={secretAccessKey}
                      onChange={(e) => setSecretAccessKey(e.target.value)}
                      onBlur={() => setSecretAccessKeyTouched(true)}
                      autoComplete="off"
                      spellCheck="false"
                      required
                      aria-invalid={secretAccessKeyMissing}
                      aria-describedby="secretAccessKeyError"
                    />
                    <button
                      type="button"
                      className="udcIconBtn"
                      aria-label={showSecretAccessKey ? "Hide Secret Access Key" : "Show Secret Access Key"}
                      aria-pressed={showSecretAccessKey}
                      onClick={() => setShowSecretAccessKey((v) => !v)}
                    >
                      <EyeIcon visible={showSecretAccessKey} />
                    </button>
                  </div>

                  {secretAccessKeyMissing ? (
                    <div className="udcFieldError" id="secretAccessKeyError" role="alert">
                      Secret Access Key is required.
                    </div>
                  ) : (
                    <div className="udcFieldErrorSpacer" aria-hidden="true" />
                  )}
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
                        required
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
                    required
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
                    required
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

              {/* Client Type + Client Name + Tagline in the same responsive row */}
              <div className="udcConfigClientRow">
                <div className="udcField">
                  <label className="udcLabel" htmlFor="clientType">
                    Client Type
                  </label>
                  <select
                    id="clientType"
                    className="udcInput"
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select client type
                    </option>
                    <option value="new">New</option>
                    <option value="existing">Existing</option>
                  </select>
                </div>

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
            <button type="button" className="udcCtaButton" onClick={onContinue} disabled={!canContinue}>
              Continue to Gap Analysis
              <span className="udcCtaArrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </section>
      </main>

      {isPresentationFormatOpen ? (
        <PresentationFormatOverlay
          formats={presentationFormatOptions}
          selectedFormatId={presentationFormat}
          slideCount={presentationSlideCount}
          onSlideCountChange={setPresentationSlideCount}
          onSelectFormat={setPresentationFormat}
          onClose={() => setIsPresentationFormatOpen(false)}
          onContinue={onPresentationFormatContinue}
        />
      ) : null}
    </div>
  );
}
