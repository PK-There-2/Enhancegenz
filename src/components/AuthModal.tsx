import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onSuccess?.();
        onClose();
      } else {
        await signUp(email, password, name, showAdminField ? adminKey : undefined);
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAdminKey('');
    setShowAdminField(false);
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full shadow-2xl relative rounded-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6">
          <h2 className="text-3xl mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Join Thread Trends'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to access your account' 
              : 'Create an account to start shopping'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-2 text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Admin Key Toggle (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <button
                type="button"
                onClick={() => setShowAdminField(!showAdminField)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {showAdminField ? 'Hide' : 'Register as Admin?'}
              </button>
              
              {showAdminField && (
                <div className="mt-2">
                  <label className="block text-sm mb-2 text-gray-700">Admin Key</label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support for admin access key
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={switchMode}
                className="text-black hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>

        {/* Demo Info */}
        <div className="px-8 pb-8">
          <div className="bg-blue-50 border border-blue-200 p-4">
            <p className="text-xs text-blue-800">
              <strong>Local Storage Mode (No Database):</strong>
              <br />
              Demo Credentials:
              <br />
              <span className="font-mono">Customer: demo@threadtrends.com / demo123</span>
              <br />
              <span className="font-mono">Admin: admin@threadtrends.com / admin123</span>
              <br />
              <span className="text-[10px] mt-1 block">Or create your own account!</span>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;