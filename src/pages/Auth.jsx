import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Auth = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState('student'); // 'student' or 'authority'

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        
        // Verify role matches the selected tab
        const token = localStorage.getItem('access_token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userRole = payload.role; // 'USER' or 'AUTHORITY'
          const selectedRole = authRole === 'authority' ? 'AUTHORITY' : 'USER';
          
          if (userRole !== selectedRole) {
            throw new Error(`This account is not registered as a ${authRole}. Please use the correct tab or create a new account.`);
          }
        }
      } else {
        if(!formData.username || !formData.email || !formData.password) {
          throw new Error("Please fill out all fields");
        }
        await signup(formData.username, formData.email, formData.password, authRole);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      background: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80") center/cover fixed'
    }}>
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--glass-bg-dark)',
          zIndex: 0
      }}></div>

      <div className="glass-panel-dark" style={{ maxWidth: '420px', width: '100%', zIndex: 1, padding: 0, overflow: 'hidden' }}>
        
        {/* Toggle Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            type="button"
            onClick={() => { setAuthRole('student'); setError(null); }}
            style={{
              flex: 1, padding: '16px', background: authRole === 'student' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none', color: '#fff', fontSize: '1rem', fontWeight: authRole === 'student' ? 'bold' : 'normal',
              cursor: 'pointer', transition: 'all 0.2s', borderBottom: authRole === 'student' ? '3px solid var(--primary-teal)' : '3px solid transparent'
            }}>
            🌿 Participant
          </button>
          <button 
            type="button"
            onClick={() => { setAuthRole('authority'); setError(null); }}
            style={{
              flex: 1, padding: '16px', background: authRole === 'authority' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none', color: '#fff', fontSize: '1rem', fontWeight: authRole === 'authority' ? 'bold' : 'normal',
              cursor: 'pointer', transition: 'all 0.2s', borderBottom: authRole === 'authority' ? '3px solid var(--accent-brown)' : '3px solid transparent'
            }}>
            🛡️ Authority
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', textDecoration: 'none'}}>
               <img src="/icon.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} onError={(e) => e.target.style.display='none'} />
               <span style={{ fontFamily: 'Montserrat', fontSize: '1.3rem', fontWeight: 800, color: authRole === 'authority' ? '#ff9800' : 'var(--primary-teal)' }}>
                  Eco Spark {authRole === 'authority' && <span style={{ color: '#fff' }}>Admin</span>}
               </span>
            </Link>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>
              {isLogin ? (authRole === 'student' ? 'Welcome Back' : 'Authority Portal Access') : (authRole === 'student' ? 'Join the Movement' : 'Admin Registration')}
            </h2>
            <p style={{ color: '#bbb', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {isLogin ? (authRole === 'student' ? 'Log in to continue your journey.' : 'Authorized personnel only.') : (authRole === 'student' ? 'Create an account to track your impact.' : 'Register new authority credentials.')}
            </p>
          </div>

          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label className="input-label" style={{ color: '#eee' }}>Username / Display Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g. EcoWarrior99 or Officer Smith"
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label" style={{ color: '#eee' }}>{authRole === 'authority' ? 'Official / Dispatch Email' : 'Email'}</label>
              <input 
                type="email" 
                className="form-control"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#eee' }}>{authRole === 'authority' ? 'Passcode' : 'Password'}</label>
              <input 
                type="password" 
                className="form-control"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Required"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: authRole === 'authority' ? '#ff9800' : 'var(--action-blue)' }}>
              {isLogin ? (authRole === 'authority' ? 'Log in as Authority' : 'Log In') : 'Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#bbb', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              style={{ color: authRole === 'authority' ? '#ff9800' : 'var(--primary-teal)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
