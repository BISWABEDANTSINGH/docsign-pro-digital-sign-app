import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState, useRef } from "react";
import api from "../api"; 
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd"; 
import SignatureCanvas from "../features/signatures/SignatureCanvas"; 
import "./DocumentViewer.css";

// Use Vite's native URL importer to load the worker safely
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface LocalSignature {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number; 
  signatureImage: string;
}

export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [doc, setDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [localSignatures, setLocalSignatures] = useState<LocalSignature[]>([]);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      try {
        const res = await api.get("/api/docs"); 
        const found = res.data.find((d: any) => d._id === id);
        setDoc(found);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const handleAddSignatureClick = () => {
    if (doc?.status === "signed") return;
    const defaultSig = localStorage.getItem("defaultSignature");
    if (defaultSig) {
      addSignatureToCanvas(defaultSig);
    } else {
      setIsModalOpen(true);
    }
  };

  const addSignatureToCanvas = (imgData: string) => {
    const newSig: LocalSignature = {
      id: Date.now().toString(),
      x: 100, y: 100, width: 150, height: 75,
      page: currentPage, 
      signatureImage: imgData,
    };
    setLocalSignatures([...localSignatures, newSig]);
    setIsModalOpen(false);
  };

  const updateSignature = (id: string, newProps: Partial<LocalSignature>) => {
    setLocalSignatures(sigs => sigs.map(sig => sig.id === id ? { ...sig, ...newProps } : sig));
  };

  const removeSignature = (id: string) => {
    setLocalSignatures(sigs => sigs.filter(sig => sig.id !== id));
  };

  const handleFinalize = async () => {
    if (localSignatures.length === 0) return alert("Please add a signature.");
    if (!pdfWrapperRef.current) return;
    
    setIsFinalizing(true);
    const containerRect = pdfWrapperRef.current.getBoundingClientRect();
    
    const signaturesPayload = localSignatures.map(sig => ({
      documentId: id,
      signatureImage: sig.signatureImage,
      page: sig.page,
      xPercent: (sig.x / containerRect.width) * 100,
      yPercent: (sig.y / containerRect.height) * 100,
      widthPercent: (sig.width / containerRect.width) * 100,
      heightPercent: (sig.height / containerRect.height) * 100,
    }));

    try {
      await Promise.all(signaturesPayload.map(payload => api.post("/api/signatures", payload)));
      await api.post(`/api/docs/finalize/${id}`);
      
      const res = await api.get("/api/docs");
      setDoc(res.data.find((d: any) => d._id === id));
      setLocalSignatures([]); 
      alert("Document signed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to finalize.");
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleDownload = () => {
    const backendUrl = api.defaults.baseURL || "http://localhost:5000";
    const fullUrl = doc.fileUrl.startsWith("http") ? doc.fileUrl : `${backendUrl}/${doc.fileUrl}`;
    
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = `Signed_${doc.title}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document? This cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/docs/${id}`); 
      alert("Document deleted successfully.");
      navigate("/"); // Redirect back to dashboard
    } catch (error) {
      console.error(error);
      alert("Failed to delete the document.");
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className="viewer-loading">Loading...</div>;
  if (!doc) return <div className="viewer-error">Document not found.</div>;

  const fileUrl = doc.fileUrl.startsWith("http") ? doc.fileUrl : `${api.defaults.baseURL || "http://localhost:5000"}/${doc.fileUrl}`;

  return (
    <div className="viewer-container">
      {/* HEADER CONTROLS */}
      <div className="viewer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 className="viewer-title" style={{ margin: 0 }}>{doc.title}</h2>
          <span className={`status-badge badge-${doc.status.toLowerCase()}`}>{doc.status}</span>
        </div>

        {/* 🔥 Now strictly using the new CSS classes! */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {doc.status === "pending" ? (
            <>
              <button onClick={handleAddSignatureClick} className="btn btn-secondary">
                + Add Signature
              </button>
              <button onClick={handleFinalize} disabled={isFinalizing || localSignatures.length === 0} className="btn btn-primary">
                {isFinalizing ? "Finalizing..." : "Finalize & Sign"}
              </button>
            </>
          ) : (
            <button onClick={handleDownload} className="btn btn-success">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          )}
          
          <button onClick={handleDelete} disabled={isDeleting} className="btn btn-danger">
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="pagination-container">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="btn-page"
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {numPages}
        </span>
        <button 
          disabled={currentPage >= numPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="btn-page"
        >
          Next
        </button>
      </div>

      {/* PDF WORKSPACE */}
      <div className="viewer-workspace">
        <div id="pdf-container" ref={pdfWrapperRef} className="pdf-container">
          
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} className="pdf-page" />
          </Document>

          {/* INTERACTIVE SIGNATURE LAYER */}
          {doc.status === "pending" && localSignatures
            .filter(sig => sig.page === currentPage)
            .map((sig) => (
            <Rnd
              key={sig.id}
              size={{ width: sig.width, height: sig.height }}
              position={{ x: sig.x, y: sig.y }}
              bounds="parent" 
              onDragStop={(e, d) => updateSignature(sig.id, { x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) => {
                updateSignature(sig.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos });
              }}
              style={{ border: "2px dashed #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
              resizeHandleStyles={{
                bottomRight: { width: '12px', height: '12px', background: '#3b82f6', right: '-6px', bottom: '-6px', borderRadius: '50%', border: '2px solid white' },
                bottomLeft: { width: '12px', height: '12px', background: '#3b82f6', left: '-6px', bottom: '-6px', borderRadius: '50%', border: '2px solid white' },
                topRight: { width: '12px', height: '12px', background: '#3b82f6', right: '-6px', top: '-6px', borderRadius: '50%', border: '2px solid white' },
                topLeft: { width: '12px', height: '12px', background: '#3b82f6', left: '-6px', top: '-6px', borderRadius: '50%', border: '2px solid white' }
              }}
            >
              <img src={sig.signatureImage} alt="Signature" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
              <button 
                onClick={() => removeSignature(sig.id)}
                style={{ position: "absolute", top: -12, right: -12, background: "#ef4444", color: "white", borderRadius: "50%", width: 24, height: 24, border: "none", cursor: "pointer", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                ✕
              </button>
            </Rnd>
          ))}
        </div>
      </div>

      {isModalOpen && <SignatureCanvas onSave={addSignatureToCanvas} onCancel={() => setIsModalOpen(false)} />}
    </div>
  );
}