import { useState } from "react";
import { Link } from "react-router-dom"; // 🔥 Removed useNavigate
import api from "../api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // 🔥 FIX: Force the browser to refresh so App.tsx sees the new token!
      window.location.href = "/";

    } catch (err: any) {
      console.error(err.response?.data || err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header/Branding */}
        <div className="login-header">
          {/* 🔥 Cleaned up Logo & Text to match the Navbar perfectly */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>

            <svg
              style={{ width: "2rem", height: "2rem", color: "#4f46e5" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>

            <span style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.025em" }}>
              DocSign <span style={{ color: "#4f46e5" }}>Pro</span>
            </span>

          </div>

          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Please enter your details to sign in.</p>
        </div>

        {/* Error Message Display */}
        {error && <div className="login-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#forgot" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="register-link">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;