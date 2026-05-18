import { useState } from 'react';
import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import { KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function SetupPassword({ onComplete }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
        setError('');
        onComplete();
      } else {
        setError('No authenticated user found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update password. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const email = auth.currentUser?.email || '';

  return (
    <div className="login-container">
      <div className="login-card glass-card fade-in">
        <div className="login-header">
          <div className="logo-icon login-logo" style={{ background: 'var(--gradient-primary)' }}>
            <KeyRound size={32} />
          </div>
          <h2>Set Password</h2>
          <p>Secure your account: <strong>{email}</strong></p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error fade-in">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">New Password</label>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <CheckCircle size={18} />
            <span>{loading ? 'Saving...' : 'Complete Setup'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
