import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import "./SignatureCanvas.css";

interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

const SignatureCanvas = ({ onSave, onCancel }: SignatureCanvasProps) => {
  const sigCanvas = useRef<SignaturePad>(null);
  const [error, setError] = useState("");

  const clear = () => {
    sigCanvas.current?.clear();
    setError("");
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      setError("Please provide a signature before saving.");
      return;
    }
    
    // Generates a base64 PNG of the drawn signature
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="sig-overlay">
      <div className="sig-modal">
        <h3 className="sig-title">Draw your signature</h3>
        
        <div className="sig-pad-container">
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: "sig-pad",
            }}
          />
        </div>
        
        {error && <p className="sig-error">{error}</p>}

        <div className="sig-actions">
          <button onClick={clear} className="btn-sig-clear">
            Clear
          </button>
          <div className="sig-actions-right">
            <button onClick={onCancel} className="btn-sig-cancel">
              Cancel
            </button>
            <button onClick={save} className="btn-sig-save">
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureCanvas;