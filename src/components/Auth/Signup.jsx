import { useState } from 'react';
import { auth } from '../../firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { Zap, UserPlus } from 'lucide-react';
import './Login.css';

export default function Signup({ onNavigate, onSignupSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: window.location.href,
      // This must be true for email link sign-in.
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      setError('');
      onSignupSuccess(email);
    } catch (err) {
      console.error(err);
      setError('Failed to send verification email. Please try again.');
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
          <h2>Create Account</h2>
          <p>Join Shaper to track your goals</p>
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
            <UserPlus size={18} />
            <span>{loading ? 'Sending Link...' : 'Continue'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <button className="text-btn" onClick={() => onNavigate('login')}>Sign In</button></p>
        </div>
      </div>
    </div>
  );
}
