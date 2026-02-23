import { useState } from "react";
// 🔥 FIX 1: Import your custom API instance
import api from "../api"; 
import "./Upload.css";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 🔥 FIX 2: Change the route to /api/docs/upload to match your backend app.ts
      // (Also removed the manual headers since your api.ts handles the token for you!)
      await api.post("/api/docs/upload", formData);
      
      alert("Uploaded Successfully");
      setFile(null); // Clear the file after successful upload
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2 className="upload-title">Upload Document</h2>
        <p className="upload-subtitle">Select a file from your device to add it to your dashboard.</p>
      </div>

      <div className="upload-card">
        {/* Styled Dropzone Area */}
        <div className="upload-dropzone">
          <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <label htmlFor="file-upload" className="upload-label">
            <span className="upload-browse">Browse files</span> to upload
          </label>
          <p className="upload-hint">Supports PDF, DOCX, and JPG (Max 10MB)</p>
          
          <input
            id="file-upload"
            type="file"
            accept="application/pdf" // 🔥 ADD THIS LINE!
            className="file-input-hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Selected File Display & Action */}
        {file && (
          <div className="upload-action-area">
            <div className="file-info">
              <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="file-name">{file.name}</span>
            </div>

            <button 
              onClick={uploadFile} 
              className="btn-upload"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;