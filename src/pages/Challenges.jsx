import React, { useState } from 'react';
import { useChallenges } from '../context/ChallengesContext';

const badgeColors = {
  'BEGINNER': '#11c03b',
  'INTERMEDIATE': '#3b82f6',
  'ADVANCED': '#e65100'
};

const Challenges = () => {
  const { challenges, joinChallenge, completeChallenge, createMission } = useChallenges();
  const [activeTab, setActiveTab] = useState('All Missions');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMission, setNewMission] = useState({ title: '', category: 'Lifestyle', xp: 50, description: '' });

  const navFilters = ['All Missions', 'Lifestyle', 'Zero Waste', 'Energy'];

  const filteredChallenges = challenges.filter(c => {
    // Tab filter
    if (activeTab !== 'All Missions' && c.category !== activeTab) return false;
    // Search filter
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMission(newMission);
    setShowCreateModal(false);
    setNewMission({ title: '', category: 'Lifestyle', xp: 50, description: '' });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
      
      {/* Create Mission Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-panel" style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Create Mission</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input required className="form-control" value={newMission.title} onChange={e => setNewMission({...newMission, title: e.target.value})} placeholder="e.g. Clean the park" />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="form-control" value={newMission.category} onChange={e => setNewMission({...newMission, category: e.target.value})}>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Zero Waste">Zero Waste</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea required className="form-control" rows="3" value={newMission.description} onChange={e => setNewMission({...newMission, description: e.target.value})} placeholder="What must be done?"></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '1rem' }}>Create custom mission</button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area: Mission Control */}
      <div>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3.2rem', marginBottom: '1rem', color: 'var(--primary-forest)', letterSpacing: '-1px' }}>Mission Control</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Unlock your potential with gamified sustainability challenges. Level up your lifestyle, one action at a time.
            </p>
          </div>
          <button className="btn btn-success" style={{ padding: '16px 24px', fontSize: '1rem', boxShadow: '0 4px 15px rgba(27, 94, 32, 0.3)' }} onClick={() => setShowCreateModal(true)}>
            + Create Mission
          </button>
        </header>

        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#fff', padding: '6px', borderRadius: '50px', boxShadow: 'var(--shadow-sm)' }}>
            {navFilters.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  fontFamily: 'Inter',
                  background: activeTab === tab ? 'var(--primary-forest)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Search missions..." 
              style={{
                padding: '12px 20px',
                borderRadius: '50px',
                border: 'none',
                boxShadow: 'var(--shadow-sm)',
                width: '280px',
                fontFamily: 'Inter'
              }}
            />
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredChallenges.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', padding: '2rem' }}>No missions found. Create one!</div>}
          
          {filteredChallenges.map((c, i) => {
            // Assign dummy difficulty based on index for the mockup
            const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
            const difficulty = c.type === 'Custom' ? 'USER CREATED' : difficulties[i % 3];
            const diffColor = c.type === 'Custom' ? 'var(--action-blue)' : badgeColors[difficulty] || '#333';

            return (
              <div key={c.id} style={{
                background: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  background: 'var(--bg-dark)',
                  borderBottom: '2px solid #eee',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ background: diffColor, color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>
                     • {difficulty}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    {c.category}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                     <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{c.title}</h3>
                     <div style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
                       ❖ {c.xp} XP
                     </div>
                  </div>
                  
                  <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                    {c.description || (c.title === 'Plastic Free Week' ? 'Navigate grocery aisles and dining out with zero waste essentials. Start your journey here.' :
                     c.title === 'Home Composting' ? 'Turn food scraps into black gold. Master the ratio of browns and greens for a healthy backyard ecosystem.' :
                     'High-impact ecological challenge. Complete the objectives locally to claim XP.')}
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {!c.joined ? (
                      <button 
                        onClick={() => joinChallenge(c.id)}
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          borderRadius: '16px', 
                          border: 'none', 
                          fontWeight: 700, 
                          fontSize: '1rem',
                          background: `linear-gradient(90deg, #b2f5ea 0%, #68d391 100%)`, 
                          color: 'var(--primary-forest)',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
                        }}>
                        Accept Mission
                      </button>
                    ) : c.completed ? (
                      <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-teal)', padding: '14px' }}>
                        ✅ Mission Accomplished
                      </div>
                    ) : (
                      <button 
                        onClick={() => completeChallenge(c.id)}
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          borderRadius: '16px', 
                          border: 'none', 
                          fontWeight: 700, 
                          fontSize: '1rem',
                          background: `var(--action-blue)`, 
                          color: '#fff',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}>
                        Validate & Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
