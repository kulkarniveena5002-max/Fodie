import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";

const Icon = ({ children, size = 19 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    const savedUsername = localStorage.getItem("adminUsername") || "admin";
    const savedPassword = localStorage.getItem("adminPassword") || "admin123";

    if (username === savedUsername && password === savedPassword) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/Admin");
    } else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  const handleResetPassword = () => {
    setResetMessage("");

    if (resetUsername.trim() !== "admin") {
      setResetMessage("Please enter the registered username: admin");
      return;
    }

    if (newPassword.trim().length < 6) {
      setResetMessage("New password must contain at least 6 characters.");
      return;
    }

    localStorage.setItem("adminUsername", "admin");
    localStorage.setItem("adminPassword", newPassword);
    setUsername("admin");
    setPassword("");
    setResetUsername("");
    setNewPassword("");
    setResetMessage("Password updated. You can now sign in with your new password.");
  };

  return (
    <main className="login-page">
      <div className="login-decoration decoration-one" />
      <div className="login-decoration decoration-two" />

      <section className="login-showcase">
        <div className="showcase-brand"><span className="brand-symbol">A</span><strong>Admin<span>Panel</span></strong></div>
        <div className="showcase-content">
          <span className="welcome-badge"><span /> Secure workspace</span>
          <h1>Manage everything<br /><em>in one place.</em></h1>
          <p>Welcome back to your central dashboard. Keep your contacts, conversations, and business moving forward.</p>
        </div>
        <div className="showcase-footer"><span className="footer-line" /><small>Simple. Secure. Efficient.</small></div>
      </section>

      <section className="login-area">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="mobile-brand"><span className="brand-symbol">A</span><strong>Admin<span>Panel</span></strong></div>
          <div className="login-heading">
            <div className="login-icon"><Icon><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19 10V7a7 7 0 0 0-14 0v3" /><rect x="3" y="10" width="18" height="11" rx="3" /></Icon></div>
            <p className="eyebrow">Admin access</p>
            <h2>Welcome back</h2>
            <p className="helper-text">Sign in to continue to your dashboard</p>
          </div>

          {error && <div className="login-error" role="alert"><Icon size={16}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Icon>{error}</div>}

          <div className="field-group">
            <label htmlFor="username">Username</label>
            <div className="input-shell"><Icon><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></Icon><input id="username" type="text" placeholder="Enter your username" value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} autoComplete="username" required /></div>
          </div>

          <div className="field-group">
            <div className="label-row"><label htmlFor="password">Password</label><button type="button" className="forgot-link" onClick={() => { setForgotOpen(true); setError(""); }}>Forgot password?</button></div>
            <div className="input-shell"><Icon><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icon><input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" required /><button type="button" className="visibility-button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <Icon size={18}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4 9.7 7.1a10.8 10.8 0 0 1-3.1 4.8M6.2 6.2C3.9 7.7 2.7 10 2.3 11.1 3.3 14 7 18 12 18c1 0 2-.2 2.9-.5" /></Icon> : <Icon size={18}><path d="M2.3 12C3.3 9 7 5 12 5s8.7 4 9.7 7c-1 3-4.7 7-9.7 7s-8.7-4-9.7-7Z" /><circle cx="12" cy="12" r="2.5" /></Icon>}</button></div>
          </div>

          {forgotOpen && (
            <div className="forgot-panel">
              <div className="forgot-panel-heading"><div><strong>Reset your password</strong><small>Enter your admin username and choose a new password.</small></div><button type="button" onClick={() => setForgotOpen(false)} aria-label="Close password reset">×</button></div>
              <label htmlFor="reset-username">Username</label>
              <input id="reset-username" type="text" placeholder="admin" value={resetUsername} onChange={(event) => setResetUsername(event.target.value)} />
              <label htmlFor="new-password">New password</label>
              <input id="new-password" type="password" placeholder="At least 6 characters" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              {resetMessage && <p className={resetMessage.startsWith("Password updated") ? "reset-success" : "reset-error"}>{resetMessage}</p>}
              <button className="reset-button" type="button" onClick={handleResetPassword}>Update password</button>
            </div>
          )}

          <label className="remember-row"><input type="checkbox" /><span className="checkmark" />Remember me for 30 days</label>
          <button className="login-submit" type="submit">Sign in <Icon size={17}><path d="M5 12h14M13 6l6 6-6 6" /></Icon></button>
          <button className="home-link" type="button" onClick={() => navigate("/")}><Icon size={16}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-6h6v6" /></Icon> Back to home</button>
          <p className="security-note"><Icon size={14}><path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></Icon> Your connection is secure and encrypted</p>
        </form>
      </section>
    </main>
  );
}

export default Login;
