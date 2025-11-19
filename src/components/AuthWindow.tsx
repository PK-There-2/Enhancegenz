"use client";
import { useEffect, useState } from "react";

const USER_STORAGE_KEY = "thread_trends_user";
const USERS_DB_KEY = "thread_trends_users_db";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showAdminField, setShowAdminField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const usersDb = localStorage.getItem(USERS_DB_KEY);
    if (!usersDb) {
      const demoUsers = [
        {
          id: "1",
          email: "demo@threadtrends.com",
          password: "demo123",
          name: "Demo User",
          role: "customer",
        },
        {
          id: "2",
          email: "admin@threadtrends.com",
          password: "admin123",
          name: "Admin User",
          role: "admin",
        },
      ];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(demoUsers));
    }
  }, []);

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setAdminKey("");
    setShowAdminField(false);
  };

  const signIn = async () => {
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
    const user = usersDb.find((u: any) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
  };

  const signUp = async () => {
    if (!name || name.trim().length === 0) {
      throw new Error("Please enter your full name");
    }
    
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
    if (usersDb.find((u: any) => u.email === email)) throw new Error("User already exists");

    const role = showAdminField && adminKey === "admin123" ? "admin" : "customer";

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name: name.trim(),
      role,
    };

    usersDb.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn();
      } else {
        await signUp();
        await signIn();
      }
      
      // Get the signed-in user from localStorage
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        
        // Send success message to parent window
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ 
            type: 'AUTH_SUCCESS', 
            user 
          }, window.location.origin);
          
          // Close popup after a short delay to ensure message is received
          setTimeout(() => {
            window.close();
          }, 300);
        } else {
          // If not in popup, reload to refresh auth state
          window.location.reload();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Thread Trends</h1>
          <p>{mode === "signin" ? "Welcome Back" : "Join Thread Trends"}</p>
        </div>

        <div style={styles.content}>
          {/* Tabs */}
          <div style={styles.tabs}>
            <button style={mode === "signin" ? styles.activeTab : styles.tab} onClick={() => switchMode("signin")}>
              Sign In
            </button>
            <button style={mode === "signup" ? styles.activeTab : styles.tab} onClick={() => switchMode("signup")}>
              Sign Up
            </button>
          </div>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div style={styles.group}>
                <label style={styles.label}>Full Name</label>
                <input 
                  style={styles.input}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
            )}

            <div style={styles.group}>
              <label style={styles.label}>Email</label>
              <input 
                style={styles.input}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Password</label>
              <input 
                style={styles.input}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••"
                minLength={6}
                required 
              />
            </div>

            {mode === "signup" && (
              <>
                <div style={{ textAlign: "center" }}>
                  <button type="button" onClick={() => setShowAdminField(!showAdminField)} style={styles.linkBtn}>
                    {showAdminField ? "🔓 Hide Admin Key" : "🔐 Register as Admin?"}
                  </button>
                </div>

                {showAdminField && (
                  <div style={styles.group}>
                    <label style={styles.label}>Admin Key</label>
                    <input 
                      style={styles.input}
                      value={adminKey} 
                      onChange={(e) => setAdminKey(e.target.value)} 
                      type="password" 
                      placeholder="Enter admin key" 
                    />
                    <p style={{ fontSize: "12px", color: "#718096", marginTop: "6px" }}>
                      Contact support for admin access key
                    </p>
                  </div>
                )}
              </>
            )}

            <button style={styles.submit} disabled={loading}>
              {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={styles.demo}>
            <strong style={{ display: "block", marginBottom: "12px", fontSize: "14px", color: "#667eea" }}>
              🎉 Demo Mode (Local Storage)
            </strong>
            Try these test accounts:<br />
            <code style={styles.demoCode}>demo@threadtrends.com / demo123</code><br />
            <code style={styles.demoCode}>admin@threadtrends.com / admin123</code><br />
            <small style={{ display: "block", marginTop: "12px", opacity: 0.7 }}>
              Or create your own account instantly!
            </small>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div[style*="minHeight: \"100vh\""] {
            padding: 10px;
          }
          div[style*="maxWidth: \"480px\""] {
            margin: 10px;
            maxWidth: none;
          }
          div[style*="padding: \"48px 40px 36px\""] {
            padding: 30px 20px 25px;
          }
          div[style*="padding: \"40px\""] {
            padding: 25px 20px;
          }
          h1 {
            font-size: 24px !important;
          }
          p {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Styles (inline to avoid CSS copy)
const styles: any = {
  body: { 
    background: "linear-gradient(135deg,#667eea,#764ba2)", 
    minHeight: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    padding: "20px",
    margin: 0,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  container: { 
    background: "#fff", 
    width: "100%",
    maxWidth: "480px", 
    borderRadius: "16px", 
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(102, 126, 234, 0.25)",
    margin: "20px"
  },
  header: { 
    textAlign: "center" as const, 
    padding: "48px 40px 36px", 
    color: "#fff", 
    background: "linear-gradient(135deg,#764ba2,#667eea)",
    boxSizing: "border-box"
  },
  content: { 
    padding: "40px",
    boxSizing: "border-box"
  },
  tabs: { 
    display: "flex", 
    gap: "8px",
    background: "#f8f9ff", 
    padding: "6px", 
    borderRadius: "12px", 
    marginBottom: "32px" 
  },
  tab: { 
    flex: 1, 
    padding: "12px 20px", 
    border: "none", 
    background: "transparent", 
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    color: "#718096",
    borderRadius: "8px",
    transition: "all 0.3s"
  },
  activeTab: { 
    flex: 1, 
    padding: "12px 20px", 
    background: "#fff", 
    borderRadius: "8px", 
    cursor: "pointer", 
    color: "#667eea",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
    transform: "scale(1.02)"
  },
  group: { 
    marginBottom: "24px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.3s",
    outline: "none",
    fontFamily: "inherit"
  },
  error: { 
    background: "#fff5f5", 
    color: "#f56565", 
    padding: "14px 16px", 
    borderRadius: "12px", 
    marginBottom: "24px",
    border: "1px solid rgba(245, 101, 101, 0.3)",
    fontSize: "14px"
  },
  linkBtn: { 
    background: "none", 
    border: "none", 
    color: "#667eea", 
    cursor: "pointer", 
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s"
  },
  submit: { 
    width: "100%", 
    padding: "16px", 
    background: "linear-gradient(135deg,#667eea,#764ba2)", 
    color: "#fff", 
    border: "none", 
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s"
  },
  demo: { 
    marginTop: "28px", 
    fontSize: "13px", 
    color: "#1a202c",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
    border: "1px solid rgba(102, 126, 234, 0.2)",
    padding: "20px",
    borderRadius: "12px"
  },
  demoCode: {
    background: "rgba(255, 255, 255, 0.8)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
    fontSize: "12px",
    display: "inline-block",
    margin: "4px 0",
    border: "1px solid rgba(102, 126, 234, 0.15)"
  }
};
