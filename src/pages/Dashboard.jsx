import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { useChallenges } from '../context/ChallengesContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { issues } = useIssues();
  const { challenges } = useChallenges();
  const navigate = useNavigate();

  const activeChallengesCount = challenges.filter(c => c.joined && !c.completed).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
      
      {/* Left Sidebar (Secondary Nav Mockup) */}
      <aside>
        <div className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
          <div style={{ padding: '0 10px', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-teal)' }}>⚡</span> Impact Feed
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Live organic growth metrics</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div onClick={() => navigate('/profile')} style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>📈 My Progress</div>
            <div onClick={() => navigate('/leaderboard')} style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>👥 Team Activity</div>
            <div onClick={() => navigate('/challenges')}  style={{ padding: '10px 14px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem', background: 'var(--primary-teal)', color: '#fff', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>
              🛡 Mission Control
            </div>
          </nav>

          <button className="btn" onClick={() => navigate('/report')} style={{ background: 'var(--primary-forest)', color: '#fff', width: '100%', marginTop: '2rem' }}>
            + New Entry
          </button>
        </div>
      </aside>

      {/* Main Impact Content */}
      <div style={{ paddingRight: '2rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, <span className="text-teal">{user.username}</span></h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Here's your impact overview and community statistics.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Level Card */}
          <div className="glass-panel hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="text-muted" style={{ fontSize: '1rem', fontWeight: 600 }}>Your Eco-Level</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: 'var(--primary-forest)', fontFamily: 'Montserrat' }}>
                {user.level}
              </div>
              <div style={{ paddingBottom: '6px', color: 'var(--primary-teal)', fontWeight: 600 }}>
                {user.xp} XP total
              </div>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '1rem' }}>
               <div style={{ width: `${(user.xp % 100)}%`, height: '100%', background: 'var(--primary-teal)' }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>{100 - (user.xp % 100)} XP to next level</p>
          </div>

          {/* Eco-Pet (Tamagotchi) Stat */}
          <div className="glass-panel hover-lift" style={{ background: 'var(--primary-teal)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Eco-Pet Status</h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', marginBottom: 'auto' }}>
               <div className="pet-breathing" style={{ fontSize: '4rem' }}>
                 {user.petHealth > 80 ? '🌳' : user.petHealth > 50 ? '🌿' : user.petHealth > 20 ? '🌱' : '🥀'}
               </div>
               <div style={{ flex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '6px' }}>
                   <span>Health</span>
                   <span>{user.petHealth}%</span>
                 </div>
                 <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${user.petHealth}%`, height: '100%', background: user.petHealth > 50 ? '#4ade80' : user.petHealth > 20 ? '#facc15' : '#f87171', transition: 'width 0.3s' }}></div>
                 </div>
                 <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>{user.streak} Day Streak 🔥</p>
               </div>
             </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Community Activity Feed</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {issues.slice(0, 3).map((issue, idx) => (
            <div key={idx} className="glass-panel flex-between hover-lift" style={{ padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '12px', background: '#eee', backgroundImage: `url(${issue.image})`, backgroundSize: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{issue.title}</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Location: {issue.location.text}</p>
                </div>
              </div>
              <div>
                <span className="badge" style={{ 
                  background: issue.status === 'Resolved' ? '#e8f5e9' : '#fff3e0',
                  color: issue.status === 'Resolved' ? 'var(--primary-forest)' : '#e65100',
                  padding: '8px 16px'
                }}>
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
