import { Link } from "react-router-dom"; // 🔥 Removed useNavigate as it's no longer needed here
import "./Navbar.css"; // Import the standard CSS file

const Navbar = () => {
  const logout = () => {
    // 1. Clear the token from storage
    localStorage.removeItem("token");
    
    // 2. 🔥 FIX: Force a hard navigation to the login page
    // This tells React to completely remount, making the Navbar disappear!
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand">
          <svg className="brand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          DocSign <span className="brand-highlight">Pro</span>
        </Link>

        {/* Navigation Links & Actions */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
          <Link to="/signatures" className="nav-link">My Signature</Link>
          <div className="nav-divider"></div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;