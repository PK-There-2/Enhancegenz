import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Local storage keys
const USER_STORAGE_KEY = 'thread_trends_user';
const USERS_DB_KEY = 'thread_trends_users_db';

// Initialize demo users if not exists
const initializeDemoData = () => {
  const usersDb = localStorage.getItem(USERS_DB_KEY);
  if (!usersDb) {
    const demoUsers = [
      {
        id: '1',
        email: 'demo@threadtrends.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'customer' as const
      },
      {
        id: '2',
        email: 'admin@threadtrends.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin' as const
      }
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(demoUsers));
    console.log('✅ Demo users initialized!');
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  // Initialize demo data on mount
  useEffect(() => {
    initializeDemoData();
  }, []);

  // Listen for auth messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // For security, you should validate event.origin in production
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
  }, [authWindow, setUser]);

  const getAccessToken = async () => {
    // Mock token for local auth
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? 'mock-token-' + JSON.parse(storedUser).id : null;
  };

  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Get users database from localStorage
      const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      
      // Find user by email and password
      const user = usersDb.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store user session (without password)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, name: string, adminKey?: string) => {
    try {
      // Get existing users
      const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      
      // Check if user already exists
      if (usersDb.find((u: any) => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const role: 'admin' | 'customer' = (adminKey && adminKey === 'admin123') ? 'admin' : 'customer';
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
        name,
        role
      };
      
      // Save to users database
      usersDb.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
      
      // Automatically sign in
      await signIn(email, password);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const openAuthWindow = () => {
    // Modal is now handled by AuthModal component in App.tsx
    // This function is kept for backwards compatibility
    // Header should use the onOpenAuth prop to open the modal
    console.log('openAuthWindow called - modal is handled by App.tsx');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, getAccessToken, openAuthWindow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
