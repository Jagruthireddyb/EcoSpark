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
    <div style={{
      minHeight: '100vh',
      width: '100vw',
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
              <button className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                ▶ Explore Impact
              </button>
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
  );
};

export default Landing;
