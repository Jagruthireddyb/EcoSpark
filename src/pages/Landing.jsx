import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPWA, setShowPWA] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPWA(true);
    });
  }, []);

  const [installMessage, setInstallMessage] = useState('');

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPWA(false);
      } else {
        setInstallMessage('Installation cancelled.');
      }
      setDeferredPrompt(null);
    } else {
      setInstallMessage('Browser does not support prompt right now.');
    }
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80") center/cover fixed',
        position: 'relative'
      }}>
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to right, rgba(10,30,15,0.9) 0%, rgba(10,30,15,0.6) 100%)',
        zIndex: 0
      }}></div>

      {/* Header Bar */}
      <header style={{ position: 'relative', zIndex: 1, padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <img src="/icon.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '4px' }} onError={(e) => e.target.style.display='none'} />
             <span style={{ fontFamily: 'Montserrat', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Eco Spark
             </span>
        </div>
      </header>

      {/* Main Content Split */}
      <main style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', padding: '0 5% 0 10%' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
          
          {/* Left Text Content */}
          <div style={{ flex: '1 1 500px', maxWidth: '650px' }}>
            <div style={{ 
              display: 'inline-block', 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)', 
              padding: '6px 16px', 
              borderRadius: '50px', 
              color: 'var(--text-light)', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
               THE FUTURE OF ENVIRONMENTALISM
            </div>
            
            <h1 style={{ fontSize: '4.5rem', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: 'Montserrat' }}>
              Empower<br/>Your<br/>Neighborhood.
            </h1>
            
            <p style={{ color: '#E0E0E0', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Join the dynamic engine for environmental accountability. Turn local reporting into global impact through community-driven data.
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                Join the Movement &rarr;
              </Link>
              <a href="#impact" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem', textDecoration: 'none' }}>
                ▶ Explore Impact
              </a>
            </div>

            {showPWA && (
              <div style={{ marginTop: '3rem', background: 'rgba(0,122,255,0.15)', border: '1px solid var(--action-blue)', color: 'white', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)', display: 'inline-block' }}>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Install EcoSpark App</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#ddd' }}>Add to Homescreen for quick access</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={handleInstallClick} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                    Install Now
                  </button>
                  {installMessage && <span style={{ fontSize: '0.8rem', color: '#ffb7b2' }}>{installMessage}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Right Orb Graphic */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '350px', height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,137,123,0.3) 0%, rgba(0,0,0,0) 70%)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 0 40px rgba(0,137,123,0.2)'
            }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#fff', fontFamily: 'Montserrat', lineHeight: 1 }}>450</div>
              <div style={{ fontSize: '0.8rem', color: '#bbb', letterSpacing: '2px', fontWeight: 600, marginTop: '8px', marginBottom: '16px' }}>COMMUNITY SPARKS</div>
              <div style={{ background: 'var(--primary-teal)', color: '#fff', padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 0 20px rgba(0,137,123,0.6)' }}>
                LIVE IMPACT
              </div>
            </div>
          </div>
          
        </div>
      </main>
      </div>

      {/* Impact Section */}
      <div id="impact" style={{ 
        minHeight: '80vh', 
        background: 'var(--bg-dark)', 
        padding: '6rem 10%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--primary-forest)', marginBottom: '1rem', fontFamily: 'Montserrat', textAlign: 'center' }}>Global Impact Dashboard</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem', textAlign: 'center', maxWidth: '600px' }}>
          Explore the real-world difference our community is making across the globe in real-time. Join today to add your spark.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', marginBottom: '4rem' }}>
          {[
            { value: '12,450+', label: 'Issues Resolved', icon: '✅' },
            { value: '8,900 Kg', label: 'Waste Audited', icon: '♻️' },
            { value: '540', label: 'Active Neighborhoods', icon: '📍' },
            { value: '450', label: 'Live Sparks', icon: '⚡' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel" style={{ background: '#fff', padding: '2rem', textAlign: 'center', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'Montserrat' }}>{stat.value}</div>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.5rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Detailed Insights Below Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', width: '100%', flexWrap: 'wrap' }}>
          {/* Monthly Goals */}
          <div className="glass-panel" style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'Montserrat' }}>Monthly Progress</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We work with local authorities to set ambitious sustainability goals every month. Here is where the community stands:</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                <span>Plastic Waste Recovered</span>
                <span style={{ color: 'var(--primary-teal)' }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e0f2f1', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'var(--primary-teal)', borderRadius: '10px' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                <span>Parks Cleaned</span>
                <span style={{ color: 'var(--action-blue)' }}>62%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e3f2fd', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '62%', height: '100%', background: 'var(--action-blue)', borderRadius: '10px' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                <span>Water Leaks Fixed</span>
                <span style={{ color: 'var(--accent-brown)' }}>95%</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#efebe9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--accent-brown)', borderRadius: '10px' }}></div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px', borderLeft: '4px solid var(--primary-forest)' }}>
              <strong>Did you know?</strong> Every verified report awards you XP and automatically escalates to local authorities when verified 3 times!
            </div>
          </div>

          {/* Recent Community Wins */}
          <div className="glass-panel" style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'Montserrat' }}>Recent Community Wins</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '16px' }}>
                <img src="https://images.unsplash.com/photo-1542385151-efd55734c76b?w=100" alt="Fixed Pipe" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                <div>
                   <div style={{ color: 'var(--primary-forest)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Water Waste • Resolved</div>
                   <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Leaking Pipe fixed in Block B</h4>
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fixed 2 days ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '16px' }}>
                <img src="https://images.unsplash.com/photo-1595278069441-2f29f7f35913?w=100" alt="Cleaned Park" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                <div>
                   <div style={{ color: 'var(--primary-teal)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Waste Mgmt • Solved</div>
                   <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Central Park cleanup squad</h4>
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fixed 5 days ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '16px' }}>
                <div style={{ width: '80px', height: '80px', background: '#ffe0b2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', borderRadius: '12px' }}>💡</div>
                <div>
                   <div style={{ color: '#e65100', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Energy • Progressing</div>
                   <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Solar panel installations</h4>
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>45% of neighborhood covered</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
