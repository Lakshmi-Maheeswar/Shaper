import { MailCheck, ArrowRight } from 'lucide-react';
import './Login.css';

export default function VerifyEmail({ email, onNavigate }) {
  return (
    <div className="login-container">
      <div className="login-card glass-card fade-in" style={{ textAlign: 'center', alignItems: 'center' }}>
        <div className="logo-icon login-logo" style={{ background: 'var(--gradient-success)', boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)' }}>
          <MailCheck size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Verify your email</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          We've sent a magic login link to <br/>
          <strong style={{ color: 'var(--text-primary)' }}>{email || 'your email address'}</strong>.
        </p>
        
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed var(--border-glass)', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p>Please check your inbox (and spam folder) and click the link to sign in and continue setting up your account.</p>
        </div>

        <button className="text-btn" onClick={() => onNavigate('login')} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Back to Login</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
