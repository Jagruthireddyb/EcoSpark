import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardAPI } from '../api/leaderboard';

const ROLE_LABELS = ['ECO-PIONEER', 'NATURE ADVOCATE', 'COMMUNITY CATALYST', 'SUSTAINABILITY LEAD', 'BRONZE PATHMAKER', 'SILVER GUARDIAN', 'ECO OVERLORD'];
const COLORS = ['#10B981', '#F59E0B', '#6366F1', '#10B981', '#E65100', '#007AFF', '#1B5E20'];
const AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&fit=crop',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&fit=crop',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&fit=crop',
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderData, setLeaderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.get()
      .then(data => {
        // data is already parsed JSON array of { user_id, email, xp, level, rank }
        const mapped = data.map((entry, i) => ({
          rank: entry.rank || i + 1,
          name: entry.email.split('@')[0],
          role: ROLE_LABELS[Math.min(i, ROLE_LABELS.length - 1)],
          level: entry.level,
          xp: entry.xp,
          avatar: AVATARS[i % AVATARS.length],
          color: COLORS[i % COLORS.length],
          isCurrentUser: user && entry.email === user.email,
        }));
        setLeaderData(mapped);
      })
      .catch((err) => {
        console.error('Failed to fetch leaderboard:', err);
        setLeaderData([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading leaderboard…</div>;
  }

  if (leaderData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>No leaderboard data yet. Start reporting issues to earn XP!</div>;
  }

  const topThree = leaderData.slice(0, 3);
  const remaining = leaderData.slice(3);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Abstract background blobs for premium feel */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(27,94,32,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: -1 }}></div>

      {/* Podium Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        gap: '2rem', 
        height: '400px', 
        marginBottom: '4rem',
        paddingTop: '2rem'
      }}>
        
        {/* Rank 2 (Left) */}
        <div className="hover-lift" style={{ 
          background: '#fff', borderRadius: '30px', padding: '2rem 1.5rem', 
          boxShadow: '0 20px 40px rgba(0,122,255,0.1)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, 
          position: 'relative', height: '320px', borderTop: '4px solid #007AFF' 
        }}>
          <h1 style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '4rem', color: 'rgba(0,122,255,0.05)', margin: 0, lineHeight: 1 }}>02</h1>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <img src={topThree[1].avatar} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, right: '-5px', background: '#007AFF', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', fontSize: '0.7rem' }}>🥈</div>
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>{topThree[1].name}</h3>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#007AFF', background: 'rgba(0,122,255,0.1)', padding: '4px 12px', borderRadius: '50px', letterSpacing: '1px' }}>
            {topThree[1].role} • LVL {topThree[1].level}
          </p>
          <div style={{ marginTop: 'auto', width: '100%', background: 'linear-gradient(135deg, #3b82f6, #007AFF)', color: '#fff', padding: '16px', borderRadius: '16px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, boxShadow: '0 8px 16px rgba(0,122,255,0.2)' }}>
            {topThree[1].xp} pts
          </div>
        </div>

        {/* Rank 1 (Center) */}
        <div className="hover-lift" style={{ 
          background: 'linear-gradient(180deg, #164e18, #1B5E20)', borderRadius: '30px', padding: '2.5rem 1.5rem', 
          boxShadow: '0 24px 48px rgba(27,94,32,0.3)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1.1, 
          position: 'relative', height: '380px', zIndex: 10 
        }}>
          <h1 style={{ position: 'absolute', top: '10px', width: '100%', textAlign: 'center', fontSize: '6rem', color: 'rgba(255,255,255,0.03)', margin: 0, lineHeight: 1 }}>01</h1>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <img src={topThree[0].avatar} alt="" style={{ width: '110px', height: '110px', borderRadius: '50%', border: '4px solid #1B5E20', boxShadow: '0 12px 24px rgba(0,0,0,0.3)', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '5px', right: '-10px', background: '#4ade80', color: '#1B5E20', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #1B5E20', fontSize: '1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>🏆</div>
          </div>
          <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>{topThree[0].name}</h3>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a7f3d0', background: 'rgba(0,0,0,0.2)', padding: '6px 16px', borderRadius: '50px', letterSpacing: '1px' }}>
            {topThree[0].role} • LVL {topThree[0].level}
          </p>
          <div style={{ marginTop: 'auto', width: '100%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#4ade80', padding: '20px', borderRadius: '20px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)' }}>
            {topThree[0].xp} <span style={{fontSize: '1rem', color: '#fff', fontWeight: 600}}>PTS</span>
          </div>
        </div>

        {/* Rank 3 (Right) */}
        <div className="hover-lift" style={{ 
          background: '#fff', borderRadius: '30px', padding: '2rem 1.5rem', 
          boxShadow: '0 20px 40px rgba(230,81,0,0.1)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, 
          position: 'relative', height: '320px', borderTop: '4px solid #E65100' 
        }}>
          <h1 style={{ position: 'absolute', top: '-10px', right: '10px', fontSize: '4rem', color: 'rgba(230,81,0,0.05)', margin: 0, lineHeight: 1 }}>03</h1>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <img src={topThree[2].avatar} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, right: '-5px', background: '#E65100', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', fontSize: '0.7rem' }}>🥉</div>
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>{topThree[2].name}</h3>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#E65100', background: 'rgba(230,81,0,0.1)', padding: '4px 12px', borderRadius: '50px', letterSpacing: '1px' }}>
            {topThree[2].role} • LVL {topThree[2].level}
          </p>
          <div style={{ marginTop: 'auto', width: '100%', background: 'linear-gradient(135deg, #f97316, #E65100)', color: '#fff', padding: '16px', borderRadius: '16px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, boxShadow: '0 8px 16px rgba(230,81,0,0.2)' }}>
            {topThree[2].xp} pts
          </div>
        </div>

      </div>

      {/* List Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 3fr 1fr 1fr', padding: '0 1rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>
        <div>RANK</div>
        <div>CONTRIBUTOR</div>
        <div style={{ textAlign: 'center' }}>LEVEL STATUS</div>
        <div style={{ textAlign: 'right' }}>TOTAL IMPACT</div>
      </div>

      {/* Ranks 4+ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {remaining.map((user) => (
          <div key={user.rank} className="glass-panel" style={{ 
            display: 'grid', gridTemplateColumns: '80px 3fr 1fr 1fr', alignItems: 'center', 
            padding: '1rem', background: user.isCurrentUser ? 'rgba(27,94,32,0.05)' : '#fff', border: 'none', borderRadius: '16px',
            boxShadow: user.isCurrentUser ? '0 0 0 2px var(--primary-teal)' : 'var(--shadow-sm)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#cfd8dc' }}>
              {user.rank.toString().padStart(2, '0')}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <img src={user.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="Avatar" />
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: user.color, borderRadius: '50%', border: '2px solid #fff' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name} {user.isCurrentUser && '(You)'}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{user.role}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
               <span style={{ background: user.color, color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>
                 LVL {user.level}
               </span>
            </div>

            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-forest)', textAlign: 'right' }}>
              {user.xp}
            </div>
          </div>
        ))}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
           <button style={{ background: 'transparent', border: 'none', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-teal)', cursor: 'pointer', letterSpacing: '1px' }}>
             LOAD MORE ENTRIES<br/>
             <div style={{ background: '#e0f2f1', width: '32px', height: '32px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
               <span style={{ transform: 'rotate(90deg)' }}>&rang;</span>
             </div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
