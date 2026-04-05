import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecospark_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep session in sync with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ecospark_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecospark_session');
    }
  }, [user]);

  const pushNotification = (userId, message) => {
    setUsersDB(db => db.map(u => u.id === userId ? { 
      ...u, 
      notifications: [{id: Date.now().toString(), text: message, read: false}, ...(u.notifications || [])]
    } : u));
    
    if (user && user.id === userId) {
      setUser(prev => ({
        ...prev,
        notifications: [{id: Date.now().toString(), text: message, read: false}, ...(prev.notifications || [])]
      }));
    }
  };

  const markNotificationsRead = () => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => ({...n, read: true}))
    }));
    setUsersDB(db => db.map(u => u.id === user.id ? { 
      ...u, 
      notifications: (u.notifications || []).map(n => ({...n, read: true}))
    } : u));
  };

  // Map API role names to frontend role names
  const mapRole = (apiRole) => {
    if (apiRole === 'AUTHORITY') return 'authority';
    return 'student';
  };

  /**
   * signup — calls POST /auth/register then auto-logs in
   * role: 'student' (maps to USER) or 'authority' (maps to AUTHORITY)
   */
  const signup = async (username, email, password, role = 'student') => {
    const apiRole = role === 'authority' ? 'AUTHORITY' : 'USER';
    // Register on backend
    await authAPI.register(email, password, apiRole);
    // Auto-login after registration
    await login(email, password);
  };

  /**
   * login — calls POST /auth/login and stores user in state
   */
  const login = async (email, password) => {
    // Get JWT token
    await authAPI.login(email, password);

    // Build a minimal user object from the token payload
    // (In production you'd call a /me endpoint — backend doesn't have one yet,
    //  so we decode the JWT payload ourselves.)
    const token = localStorage.getItem('access_token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    const loggedInUser = {
      id: payload.sub,
      email,
      role: payload.role ? mapRole(payload.role) : 'student',
      xp: 0,
      level: 1,
      petHealth: 100,
      streak: 1,
      badges: ['Eco Starter'],
      notifications: [{ id: 'n1', text: 'Welcome to Eco Spark!', read: false }],
    };

    setUser(loggedInUser);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const healPet = (amount) => {
    if (!user) return;
    setUser(prev => {
      const newHealth = Math.min(prev.petHealth + amount, 100);
      const updatedUser = { ...prev, petHealth: newHealth };
      setUsersDB(db => db.map(u => u.id === prev.id ? { ...u, petHealth: newHealth } : u));
      return updatedUser;
    });
  };

  const damagePet = (amount) => {
    if (!user) return;
    setUser(prev => {
      const newHealth = Math.max(prev.petHealth - amount, 0);
      const updatedUser = { ...prev, petHealth: newHealth };
      setUsersDB(db => db.map(u => u.id === prev.id ? { ...u, petHealth: newHealth } : u));
      return updatedUser;
    });
  };

  const addXP = (amount) => {
    if (!user) return;
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      const leveledUp = newLevel > prev.level;
      
      const updatedUser = { ...prev, xp: newXP, level: newLevel };
      setUsersDB(db => db.map(u => u.id === prev.id ? { ...u, xp: newXP, level: newLevel } : u));
      
      if (leveledUp) {
        pushNotification(prev.id, `🎉 Awesome! You just reached Level ${newLevel}!`);
      }
      return updatedUser;
    });
    
    // Also heal pet on XP gain
    healPet(Math.floor(amount / 2));
  };

  const unlockBadge = (badgeName) => {
    if (!user || user.badges.includes(badgeName)) return;
    setUser(prev => {
      const updatedUser = { ...prev, badges: [...prev.badges, badgeName] };
      setUsersDB(db => db.map(u => u.id === prev.id ? { ...u, badges: updatedUser.badges } : u));
      pushNotification(prev.id, `🏆 You earned a new badge: ${badgeName}`);
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, addXP, unlockBadge, healPet, damagePet, pushNotification, markNotificationsRead }}>
      {children}
    </AuthContext.Provider>
  );
};
