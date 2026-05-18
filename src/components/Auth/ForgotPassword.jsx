import { useState } from 'react';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail, ArrowRight } from 'lucide-react';
import './Login.css';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        // For security, you might not want to tell them if an email is registered or not,
        // but for this app it's fine.
        setError('No account found with that email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card glass-card fade-in" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div className="logo-icon login-logo" style={{ background: 'var(--gradient-primary)' }}>
            <Mail size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Check your email</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
            We've sent password reset instructions to <br/>
            <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
          </p>
          
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed var(--border-glass)', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <p>Please check your inbox (and spam folder) and click the link to reset your password.</p>
          </div>

          <button className="text-btn" onClick={() => onNavigate('login')} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Back to Login</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card glass-card fade-in">
        <div className="login-header">
          <div className="logo-icon login-logo" style={{ background: 'var(--gradient-primary)' }}>
            <Mail size={32} />
          </div>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link.</p>
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

          <button type="submit" className="login-btn" disabled={loading}>
            <Mail size={18} />
            <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>Remember your password? <button className="text-btn" onClick={() => onNavigate('login')}>Sign In</button></p>
        </div>
      </div>
    </div>
  );
}
