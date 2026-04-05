import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChallenges } from '../context/ChallengesContext';

const Profile = () => {
  const { user } = useAuth();
  const { challenges } = useChallenges();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState('');

  useEffect(() => {
    // Listen for the beforeinstallprompt to save it for our custom button
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstallMessage('');
      } else {
        setInstallMessage('Installation manually cancelled.');
      }
    } else {
      setInstallMessage("App is already installed or browser blocked the prompt.");
    }
  };

  if (!user) return <div style={{ padding: '2rem' }}>Please log in to view your profile.</div>;

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-forest)' }}>My Profile</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <button className="btn btn-primary" onClick={handleInstallClick} style={{ padding: '12px 24px' }}>
            📱 Install App to Desktop
          </button>
          {installMessage && <span style={{ fontSize: '0.85rem', color: '#c62828', fontWeight: 'bold' }}>{installMessage}</span>}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Left Column: Stats & Eco Pet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ background: '#fff', textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-teal)', color: '#fff', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2>{user.username}</h2>
            <p className="text-muted">{user.email}</p>
            <div style={{ marginTop: '1rem', background: '#e8f5e9', color: 'var(--primary-forest)', padding: '8px', borderRadius: '50px', fontWeight: 'bold' }}>
              Level {user.level} • {user.xp} XP
            </div>
          </div>

          <div className="glass-panel" style={{ background: '#fff', textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tamagotchi Health</h3>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', transition: 'all 0.3s' }}>
              {user.petHealth > 80 ? '🌳' : user.petHealth > 50 ? '🌿' : user.petHealth > 20 ? '🌱' : '🥀'}
            </div>
            
            {/* Health Bar */}
            <div style={{ width: '100%', height: '12px', background: '#eee', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${user.petHealth}%`, 
                background: user.petHealth > 50 ? 'var(--primary-forest)' : user.petHealth > 20 ? '#fbbf24' : '#ef4444',
                transition: 'width 0.5s'
              }} />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              {user.petHealth}% Vitality ({user.streak} Day Streak 🔥)
            </p>
          </div>

        </div>

        {/* Right Column: Badges & Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>My Badges</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {user.badges?.map(badge => (
                <div key={badge} style={{ background: '#fff3e0', color: '#e65100', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem', border: '1px solid #ffe0b2' }}>
                  🏆 {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ background: '#fff', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Missions Completed ({completedCount})</h3>
            
            {completedCount === 0 ? (
              <p className="text-muted">You haven't completed any missions yet. Head over to Mission Control!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {challenges.filter(c => c.completed).map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '12px', borderLeft: '4px solid var(--primary-teal)' }}>
                    <span style={{ fontWeight: 600 }}>{c.title}</span>
                    <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>+{c.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
