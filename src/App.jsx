import { useState, useEffect } from 'react';
import { useFirestore } from './hooks/useFirestore';
import { auth } from './firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import GoalList from './components/Goals/GoalList';
import DailyChecklist from './components/Checklist/DailyChecklist';
import TrackerGraph from './components/Tracker/TrackerGraph';
import HistoryModal from './components/Modals/HistoryModal';
import CompletedGoalsModal from './components/Modals/CompletedGoalsModal';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import SetupPassword from './components/Auth/SetupPassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import { Zap, LogOut } from 'lucide-react';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'verify', 'setup-password', 'forgot-password'
  const [verifyEmail, setVerifyEmail] = useState('');
  
  // Use custom Firestore hook instead of local storage
  const { 
    goals, setGoals, 
    checklist, setChecklist, 
    history, setHistory 
  } = useFirestore(user);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompletedGoalsOpen, setIsCompletedGoalsOpen] = useState(false);

  // Handle Auth State & Email Links
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Check if coming from an email link (Signup / Magic Link)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            // If it's a new user and they haven't set a password yet, we should ask them to set one.
            // Since we don't know if they have a password, we will just force them to setup password screen
            // after email link sign in, as per the requested flow.
            setCurrentView('setup-password');
          })
          .catch((error) => {
            console.error('Error signing in with email link', error);
          });
      }
    }

    return () => unsubscribe();
  }, []);

  const handleDayClose = (oldChecklist) => {
    if (!oldChecklist.date || oldChecklist.tasks.length === 0) return;
    const completed = oldChecklist.tasks.filter((t) => t.done).length;
    const total = oldChecklist.tasks.length;
    setHistory((prev) => {
      const exists = prev.find((h) => h.date === oldChecklist.date);
      if (exists) return prev;
      return [...prev, { date: oldChecklist.date, completed, total, tasks: oldChecklist.tasks }];
    });
  };

  const handleNavigate = (view, email = '') => {
    setCurrentView(view);
    if (email) setVerifyEmail(email);
  };

  const handleSignupSuccess = (email) => {
    setVerifyEmail(email);
    setCurrentView('verify');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (loading) {
    return <div className="app-container"><div style={{padding: '50px', textAlign: 'center'}}>Loading...</div></div>;
  }

  // If user is logged in AND they are not actively trying to set a password
  if (!user || currentView === 'setup-password') {
    if (currentView === 'signup') {
      return <Signup onNavigate={handleNavigate} onSignupSuccess={handleSignupSuccess} />;
    }
    if (currentView === 'verify') {
      return <VerifyEmail email={verifyEmail} onNavigate={handleNavigate} />;
    }
    if (currentView === 'setup-password') {
      return <SetupPassword onComplete={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'forgot-password') {
      return <ForgotPassword onNavigate={handleNavigate} />;
    }
    return <Login onNavigate={handleNavigate} />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header fade-in">
        <div className="app-logo">
          <div className="logo-icon">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="app-title">Shaper</h1>
            <p className="app-subtitle">Shape your goals. Track your grind.</p>
          </div>
        </div>
        <div className="app-header-actions">
          <button className="header-btn" onClick={() => setIsCompletedGoalsOpen(true)}>
            Completed Goals
          </button>
          <button className="header-btn" onClick={() => setIsHistoryOpen(true)}>
            History
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Goals */}
      <main className="app-main">
        <GoalList goals={goals} setGoals={setGoals} />

        {/* Checklist + Tracker side by side */}
        <div className="bottom-panels">
          <DailyChecklist
            checklist={checklist}
            setChecklist={setChecklist}
            onDayClose={handleDayClose}
          />
          <TrackerGraph history={history} />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with focus & consistency &mdash; <strong>Shaper</strong> © {new Date().getFullYear()}</p>
      </footer>

      {/* Modals */}
      {isHistoryOpen && (
        <HistoryModal history={history} onClose={() => setIsHistoryOpen(false)} />
      )}
      {isCompletedGoalsOpen && (
        <CompletedGoalsModal goals={goals} setGoals={setGoals} onClose={() => setIsCompletedGoalsOpen(false)} />
      )}
    </div>
  );
}
