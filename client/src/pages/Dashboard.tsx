import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
// 🔥 Import your custom api instead of default axios
import api from "../api"; 
import "./Dashboard.css"; 

interface DocumentType {
  _id: string;
  title: string;
  status: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setIsLoading(true);
      
      const res = await api.get("/api/docs");
      console.log("API RESPONSE:", res.data);

      if (Array.isArray(res.data)) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocs =
    filter === "all"
      ? documents
      : documents.filter((doc) => doc.status === filter);

  // Helper function to assign standard CSS classes based on status
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed":
        return "badge-signed";
      case "pending":
        return "badge-pending";
      case "rejected":
        return "badge-rejected";
      default:
        return "badge-default";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-titles">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">Manage and track your documents</p>
        </div>

        {/* Filter Dropdown */}
        <div className="filter-wrapper">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Documents</option>
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
            <option value="rejected">Rejected</option>
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="select-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading your documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        // Empty State
        <div className="empty-state">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="empty-title">No documents found.</p>
          <p className="empty-subtitle">Try changing your filter or upload a new document.</p>
        </div>
      ) : (
        // Document Cards Grid
        <div className="document-grid">
          {filteredDocs.map((doc) => (
            // 🔥 FIX IS HERE: The Link tag now completely wraps the document-card
            <Link 
              to={`/document/${doc._id}`} 
              key={doc._id} 
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="document-card" style={{ cursor: "pointer" }}>
                <h3 className="document-title">{doc.title}</h3>
                <div className="document-footer">
                  <span className={`status-badge ${getStatusClass(doc.status)}`}>
                    {doc.status}
                  </span>
                  <span className="document-id">ID: {doc._id.slice(-4)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;