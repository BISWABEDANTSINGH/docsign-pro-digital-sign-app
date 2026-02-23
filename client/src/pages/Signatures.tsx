import { useState, useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import "./Signatures.css";

const Signatures = () => {
  const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const sigCanvas = useRef<SignaturePad>(null);

  // Load existing signature on mount
  useEffect(() => {
    const stored = localStorage.getItem("defaultSignature");
    if (stored) setSavedSignature(stored);
  }, []);

const handleSaveDrawn = () => {
    if (sigCanvas.current?.isEmpty()) {
      setMessage({ type: "error", text: "Please draw a signature first." });
      return;
    }
    
    // 🔥 THE FIX: Changed getTrimmedCanvas() to getCanvas()
    const dataUrl = sigCanvas.current?.getCanvas().toDataURL("image/png");
    
    if (dataUrl) {
      localStorage.setItem("defaultSignature", dataUrl);
      setSavedSignature(dataUrl);
      setMessage({ type: "success", text: "Signature saved successfully!" });
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload a valid image file (PNG, JPG)." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      localStorage.setItem("defaultSignature", base64String);
      setSavedSignature(base64String);
      setMessage({ type: "success", text: "Signature uploaded and saved!" });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSignature = () => {
    localStorage.removeItem("defaultSignature");
    setSavedSignature(null);
    setMessage({ type: "success", text: "Signature deleted." });
    if (sigCanvas.current) sigCanvas.current.clear();
  };

  return (
    <div className="sig-page-container">
      <div className="sig-page-header">
        <h2 className="sig-page-title">My Signature</h2>
        <p className="sig-page-subtitle">Create or upload a default signature to quickly sign your documents.</p>
      </div>

      {message && (
        <div className={`sig-alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="sig-content-grid">
        {/* Left Column: Creation Tools */}
        <div className="sig-card">
          <div className="sig-tabs">
            <button 
              className={`sig-tab ${activeTab === "draw" ? "active" : ""}`}
              onClick={() => setActiveTab("draw")}
            >
              Draw Signature
            </button>
            <button 
              className={`sig-tab ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload Image
            </button>
          </div>

          <div className="sig-tab-content">
            {activeTab === "draw" ? (
              <div className="sig-draw-section">
                <div className="sig-pad-wrapper">
                  <SignaturePad
                    ref={sigCanvas}
                    canvasProps={{ className: "sig-canvas" }}
                  />
                </div>
                <div className="sig-actions">
                  <button onClick={() => sigCanvas.current?.clear()} className="btn-secondary">Clear Pad</button>
                  <button onClick={handleSaveDrawn} className="btn-primary">Save Drawn Signature</button>
                </div>
              </div>
            ) : (
              <div className="sig-upload-section">
                <label htmlFor="sig-upload" className="sig-upload-dropzone">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="upload-text">Click to browse or drag image here</span>
                  <span className="upload-hint">Transparent PNGs look best</span>
                </label>
                <input 
                  id="sig-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden-input" 
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="sig-preview-card">
          <h3 className="preview-title">Current Default Signature</h3>
          <div className="preview-box">
            {savedSignature ? (
              <img src={savedSignature} alt="Saved Signature" className="preview-image" />
            ) : (
              <p className="preview-empty">No signature saved yet.</p>
            )}
          </div>
          {savedSignature && (
            <button onClick={handleDeleteSignature} className="btn-danger">
              Delete Signature
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signatures;