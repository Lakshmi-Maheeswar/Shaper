import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Zap, LogIn, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      // App.jsx will automatically handle the redirect based on auth state changes
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Incorrect email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card fade-in">
        <div className="login-header">
          <div className="logo-icon login-logo">
            <Zap size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to shape your goals</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error fade-in">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p><button className="text-btn" onClick={() => onNavigate('forgot-password')}>Forgot Password?</button></p>
          <p>Don't have an account? <button className="text-btn" onClick={() => onNavigate('signup')}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}
