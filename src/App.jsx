import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IssuesProvider } from './context/IssuesContext';
import { ChallengesProvider } from './context/ChallengesContext';

import TopNav from './components/TopNav';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import IssueTracker from './pages/IssueTracker';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AuthorityDashboard from './pages/AuthorityDashboard';
import Rewards from './pages/Rewards';

const AppRoutes = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <IssuesProvider>
      <ChallengesProvider>
        <TopNav />
        <main className="page-container app-container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/tracker" element={<IssueTracker />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/authority" element={<AuthorityDashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/" element={<Navigate to={user?.role === 'authority' ? '/authority' : '/dashboard'} replace />} />
            <Route path="*" element={<Navigate to={user?.role === 'authority' ? '/authority' : '/dashboard'} replace />} />
          </Routes>
        </main>
      </ChallengesProvider>
    </IssuesProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

