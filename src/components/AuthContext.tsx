import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createRoot } from "react-dom/client";
import AuthWindow from './AuthWindow';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, adminKey?: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  openAuthWindow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local Storage Keys
const USER_STORAGE_KEY = 'thread_trends_user';
const USERS_DB_KEY = 'thread_trends_users_db';

// Initialize demo accounts
const initializeDemoData = () => {
  const usersDb = localStorage.getItem(USERS_DB_KEY);
  if (!usersDb) {
    const demoUsers = [
      { id: '1', email: 'demo@threadtrends.com', password: 'demo123', name: 'Demo User', role: 'customer' as const },
      { id: '2', email: 'admin@threadtrends.com', password: 'admin123', name: 'Admin User', role: 'admin' as const }
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(demoUsers));
    console.log('✅ Demo users initialized');
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  useEffect(() => {
    initializeDemoData();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_SUCCESS') {
        setUser(event.data.user);
        if (authWindow) {
          authWindow.close();
          setAuthWindow(null);
        }
      } else if (event.data.type === 'AUTH_CLOSED') {
        setAuthWindow(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [authWindow]);

  const fetchUser = async () => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    setUser(stored ? JSON.parse(stored) : null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const found = usersDb.find((u: any) => u.email === email && u.password === password);

    if (!found) throw new Error('Invalid email or password');

    const { password: _, ...publicUser } = found;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
  };

  const signUp = async (email: string, password: string, name: string, adminKey?: string) => {
    if (!name || name.trim().length === 0) {
      throw new Error('Please enter your full name');
    }
    
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');

    if (usersDb.find((u: any) => u.email === email)) throw new Error('User already exists');

    const role: 'admin' | 'customer' = adminKey === 'admin123' ? 'admin' : 'customer';
    const newUser = { id: Date.now().toString(), email, password, name: name.trim(), role };

    usersDb.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));

    await signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const getAccessToken = async () => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? 'mock-token-' + JSON.parse(stored).id : null;
  };

  // ✅ Popup Logic (React inside popup)
  const openAuthWindow = () => {
    const width = 500;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "",
      "Thread Trends Login",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) return;
    setAuthWindow(popup);

    popup.document.title = "Thread Trends Login";

    const container = popup.document.createElement("div");
    popup.document.body.appendChild(container);

    // ✅ Inject compiled Tailwind CSS
    const style = popup.document.createElement("link");
    style.rel = "stylesheet";
    style.href = "/index.css"; // IMPORTANT: Vite bundles to /index.css in dist
    popup.document.head.appendChild(style);

    const root = createRoot(container);
    root.render(<AuthWindow />);

    popup.focus();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, getAccessToken, openAuthWindow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
