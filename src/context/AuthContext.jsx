import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecospark_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersDB, setUsersDB] = useState(() => {
    const saved = localStorage.getItem('ecospark_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecospark_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecospark_session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ecospark_users', JSON.stringify(usersDB));
  }, [usersDB]);

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

  const signup = (username, email, password, role = 'student') => {
    if (usersDB.find(u => u.email === email)) {
      throw new Error('Email already in use.');
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // Note: plain text for prototyping only
      role,
      xp: 120,
      level: 2,
      petHealth: 100,
      streak: 1,
      badges: ['Eco Starter'],
      notifications: [{id: 'n1', text: 'Welcome to Eco Spark!', read: false}]
    };
    setUsersDB([...usersDB, newUser]);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const login = (email, password) => {
    const existingUser = usersDB.find(u => u.email === email && u.password === password);
    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }
    
    // Polyfill new attributes for old mock users
    existingUser.petHealth = existingUser.petHealth || 100;
    existingUser.streak = existingUser.streak || 1;
    existingUser.notifications = existingUser.notifications || [];

    const { password: _, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    pushNotification(existingUser.id, 'Welcome back! Your Eco-Pet missed you.');
  };

  const logout = () => setUser(null);

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
