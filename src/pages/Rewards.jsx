import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const dummyRewards = [
  {
    id: 1,
    brand: 'EcoWear',
    title: '20% Off Sustainable Clothing',
    description: 'Get a 20% discount on all purchases from EcoWear. Valid for all organic cotton and recycled materials.',
    cost: 500,
    code: 'ECO20WA',
    category: 'Fashion',
    logo: '🌿'
  },
  {
    id: 2,
    brand: 'GreenBite',
    title: 'Free Vegan Meal Prep',
    description: 'Redeem this for one free meal from our local plant-based menu when you order a weekly plan.',
    cost: 800,
    code: 'GBVEGANFREE',
    category: 'Food',
    logo: '🥗'
  },
  {
    id: 3,
    brand: 'ZeroWaste Co.',
    title: '15% Off Starter Kits',
    description: 'Kickstart your zero waste journey with 15% off bamboo toothbrushes, metal straws, and reusable bags.',
    cost: 300,
    code: 'ZWSTARTER15',
    category: 'Lifestyle',
    logo: '♻️'
  },
  {
    id: 4,
    brand: 'Local Transit Metro',
    title: 'Free Day Pass',
    description: 'Use public transportation for free for an entire day. Good for all local bus and train lines.',
    cost: 1000,
    code: 'METROECODAY',
    category: 'Transport',
    logo: '🚆'
  },
  {
    id: 5,
    brand: 'Solar Tech',
    title: '$50 Off Portable Chargers',
    description: 'Save $50 on any solar-powered portable charger or power bank.',
    cost: 1500,
    code: 'SOLARPOWER50',
    category: 'Tech',
    logo: '☀️'
  },
  {
    id: 6,
    brand: 'Nature First',
    title: 'Buy 1 Get 1 Tree Planted',
    description: 'For every item you purchase, we will plant two trees instead of one on your behalf.',
    cost: 200,
    code: 'DOUBLETREE',
    category: 'Impact',
    logo: '🌳'
  }
];

const badgeColors = {
  'Fashion': '#e65100',
  'Food': '#11c03b',
  'Lifestyle': '#3b82f6',
  'Transport': '#8e44ad',
  'Tech': '#f1c40f',
  'Impact': '#2ecc71'
};

const Rewards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [redeemed, setRedeemed] = useState([]);

  const categories = ['All', ...new Set(dummyRewards.map(r => r.category))];

  const filteredRewards = dummyRewards.filter(r => {
    if (activeTab !== 'All' && r.category !== activeTab) return false;
    return true;
  });

  const handleRedeem = (id, cost) => {
    if ((user?.xp || 0) < cost) {
      alert("You don't have enough XP to redeem this reward yet!");
      return;
    }
    if (!redeemed.includes(id)) {
      setRedeemed([...redeemed, id]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
      
      {/* Header Area */}
      <div>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3.2rem', marginBottom: '1rem', color: 'var(--primary-forest)', letterSpacing: '-1px' }}>Rewards Hub</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Redeem your hard-earned XP for exclusive discounts from our eco-friendly local and global brand partners.
            </p>
          </div>
          
          {/* User Points Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-forest), var(--primary-teal))', 
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(27, 94, 32, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '200px'
          }}>
            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, opacity: 0.9 }}>Your Balance</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{user?.xp || 0}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>XP</span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#fff', padding: '6px', borderRadius: '50px', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
            {categories.map(tab => (
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
        </div>

        {/* Rewards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredRewards.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', padding: '2rem' }}>No rewards found in this category.</div>}
          
          {filteredRewards.map((reward) => {
            const isRedeemed = redeemed.includes(reward.id);
            const canAfford = (user?.xp || 0) >= reward.cost;
            const catColor = badgeColors[reward.category] || '#333';

            return (
              <div key={reward.id} style={{
                background: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                <div style={{ 
                  background: 'var(--bg-dark)',
                  borderBottom: '2px solid #eee',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '2.5rem', background: '#fff', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    {reward.logo}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: catColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      {reward.category}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {reward.brand}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: '1rem', alignItems: 'flex-start' }}>
                     <h3 style={{ fontSize: '1.2rem', margin: 0, paddingRight: '1rem', lineHeight: 1.3 }}>{reward.title}</h3>
                     <div style={{ background: '#f8f9fa', padding: '6px 14px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 800, color: canAfford ? 'var(--primary-teal)' : '#9e9e9e', border: canAfford ? '1px solid #b2f5ea' : '1px solid #e0e0e0', whiteSpace: 'nowrap' }}>
                       ✨ {reward.cost} XP
                     </div>
                  </div>
                  
                  <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem', flex: 1 }}>
                    {reward.description}
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {isRedeemed ? (
                      <div style={{ background: '#e8f5e9', border: '2px dashed #4caf50', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Your Discount Code</div>
                        <div style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '2px', fontFamily: 'monospace' }}>{reward.code}</div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRedeem(reward.id, reward.cost)}
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          borderRadius: '16px', 
                          border: 'none', 
                          fontWeight: 700, 
                          fontSize: '1rem',
                          background: canAfford ? `linear-gradient(90deg, #A7F3D0 0%, #34D399 100%)` : '#e0e0e0',
                          color: canAfford ? 'var(--primary-forest)' : '#9e9e9e',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                          boxShadow: canAfford ? '0 4px 14px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all 0.2s'
                        }}>
                        {canAfford ? 'Redeem Reward' : 'Not Enough XP'}
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

export default Rewards;
