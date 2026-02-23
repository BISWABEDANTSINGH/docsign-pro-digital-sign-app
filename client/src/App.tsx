import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
// 🔥 Import the two new pages we created
import DocumentViewer from "./pages/DocumentViewer"; 
import Signatures from "./pages/Signatures"; 

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {token && <Navbar />}

        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/upload"
              element={token ? <Upload /> : <Navigate to="/login" />}
            />
            {/* 🔥 Add the routing for the Document Viewer (expects an ID in the URL) */}
            <Route
              path="/document/:id"
              element={token ? <DocumentViewer /> : <Navigate to="/login" />}
            />
            {/* 🔥 Add the routing for the My Signatures setup page */}
            <Route
              path="/signatures"
              element={token ? <Signatures /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;