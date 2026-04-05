import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNav = () => {
  const { user, logout, markNotificationsRead } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Map Tracker', path: '/tracker' },
    { name: 'Reporting', path: '/report' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Rewards', path: '/rewards' },
  ];

  const isAuthority = user?.role === 'authority';
  const displayLinks = isAuthority
    ? [{ name: 'Authority Deck', path: '/authority' }]
    : navLinks;

  const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      backgroundColor: '#fff',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem'
    }}>
      <div className="app-container flex-between" style={{ padding: 0 }}>
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontFamily: 'Montserrat', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
            Eco Spark
          </span>
        </Link>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {displayLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  display: 'inline-block',
                  color: isActive ? 'var(--primary-forest)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  position: 'relative',
                  padding: '8px 4px',
                  pointerEvents: 'auto'
                }}
              >
                {link.name}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '10%',
                    width: '80%',
                    height: '2px',
                    backgroundColor: 'var(--primary-forest)',
                    borderRadius: '2px'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Stats & Profile elements */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          
          {!isAuthority && (
            <div style={{
              background: '#e8f5e9',
              color: 'var(--primary-forest)',
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Level {user?.level || 1} • {user?.xp || 0} pts
            </div>
          )}
          
          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button onClick={handleNotificationsClick} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', position: 'relative' }}>
              🔔
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, background: '#e65100', color: '#fff', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '50px', fontWeight: 'bold' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div style={{ position: 'absolute', top: '45px', right: '-60px', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)', padding: '1rem', border: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Notifications</h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(!user?.notifications || user.notifications.length === 0) && <p style={{ color: 'var(--text-muted)' }}>No new alerts.</p>}
                  {user?.notifications?.map(n => (
                    <div key={n.id} style={{ background: n.read ? 'transparent' : '#f0f9ff', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary-teal)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </button>

            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '50px', right: 0, width: '150px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)', padding: '0.5rem', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                <Link to="/profile" onClick={() => setShowProfileMenu(false)} style={{ padding: '10px', color: 'var(--text-main)', fontWeight: 600, display: 'block' }}>Profile</Link>
                <div style={{ height: '1px', background: '#eee', margin: '4px 0' }}></div>
                <button onClick={logout} style={{ padding: '10px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#c62828', fontWeight: 600 }}>Log Out</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopNav;
