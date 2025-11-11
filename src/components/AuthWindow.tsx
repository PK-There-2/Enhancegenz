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
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
    if (usersDb.find((u: any) => u.email === email)) throw new Error("User already exists");

    const role = showAdminField && adminKey === "admin123" ? "admin" : "customer";

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
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
      if (mode === "signin") await signIn();
      else {
        await signUp();
        await signIn();
      }
      alert("Success!");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
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
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
              </div>
            )}

            <div style={styles.group}>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            </div>

            <div style={styles.group}>
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>

            {mode === "signup" && (
              <>
                <button type="button" onClick={() => setShowAdminField(!showAdminField)} style={styles.linkBtn}>
                  {showAdminField ? "Hide Admin Key" : "Register as Admin?"}
                </button>

                {showAdminField && (
                  <div style={styles.group}>
                    <label>Admin Key</label>
                    <input value={adminKey} onChange={(e) => setAdminKey(e.target.value)} type="password" placeholder="Enter admin key" />
                  </div>
                )}
              </>
            )}

            <button style={styles.submit} disabled={loading}>
              {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={styles.demo}>
            <strong>Demo Logins:</strong>
            <code>demo@threadtrends.com / demo123</code>
            <code>admin@threadtrends.com / admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles (inline to avoid CSS copy)
const styles: any = {
  body: { background: "linear-gradient(135deg,#667eea,#764ba2)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  container: { background: "#fff", width: "420px", borderRadius: "12px", overflow: "hidden" },
  header: { textAlign: "center", padding: "30px", color: "#fff", background: "linear-gradient(135deg,#667eea,#764ba2)" },
  content: { padding: "30px" },
  tabs: { display: "flex", background: "#eee", padding: "4px", borderRadius: "6px", marginBottom: "20px" },
  tab: { flex: 1, padding: "10px", border: 0, background: "transparent", cursor: "pointer" },
  activeTab: { flex: 1, padding: "10px", background: "#fff", borderRadius: "6px", cursor: "pointer", color: "#667eea" },
  group: { marginBottom: "15px" },
  error: { background: "#fee", color: "#c33", padding: "10px", borderRadius: "6px", marginBottom: "15px" },
  linkBtn: { background: "none", border: "none", color: "#667eea", cursor: "pointer", marginBottom: "5px" },
  submit: { width: "100%", padding: "12px", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", border: "none", borderRadius: "6px" },
  demo: { marginTop: "15px", fontSize: "12px", color: "#333" },
};
