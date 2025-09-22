import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CandidatesProvider } from './context/CandidatesContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Voting from './components/Voting';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import MyVote from './components/MyVote';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function Navigation() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  return (
    <nav>
      <div className="nav-brand">
        <h2>🗳️ Online Voting System</h2>
      </div>

      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Login</Link>
            <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
            {user.role !== 'admin' && (
              <>
                <Link to="/voting" className={location.pathname === '/voting' ? 'active' : ''}>Vote</Link>
                <Link to="/my-vote" className={location.pathname === '/my-vote' ? 'active' : ''}>My Vote</Link>
              </>
            )}
            <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>Results</Link>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </>
        )}
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/candidates" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          <Route path="/voting" element={<ProtectedRoute voterOnly={true}><Voting /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/my-vote" element={<ProtectedRoute voterOnly={true}><MyVote /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CandidatesProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </CandidatesProvider>
    </ThemeProvider>
  );
}

export default App;
