import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChallengesContext = createContext();

export const useChallenges = () => useContext(ChallengesContext);

export const ChallengesProvider = ({ children }) => {
  const { addXP } = useAuth();
  
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('ecospark_challenges');
    if (saved) return JSON.parse(saved);
    
    return [
      { id: 'c1', title: 'Zero Waste Day', type: 'Daily', category: 'Zero Waste', xp: 50, activeParticipants: 120, joined: false, completed: false },
      { id: 'c2', title: 'Plant a Seedling', type: 'Weekly', category: 'Lifestyle', xp: 200, activeParticipants: 45, joined: false, completed: false },
      { id: 'c3', title: 'Carpool to School', type: 'Daily', category: 'Energy', xp: 30, activeParticipants: 210, joined: false, completed: false },
      { id: 'c4', title: 'No Plastic Bottles', type: 'Weekly', category: 'Zero Waste', xp: 150, activeParticipants: 300, joined: false, completed: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ecospark_challenges', JSON.stringify(challenges));
  }, [challenges]);

  const joinChallenge = (id) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, joined: true, activeParticipants: c.activeParticipants + 1 } : c
    ));
  };

  const completeChallenge = (id) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) return;
    
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, completed: true } : c
    ));
    
    addXP(challenge.xp);
  };

  const createMission = (mission) => {
    const newMission = {
      ...mission,
      id: 'custom_' + Date.now(),
      type: 'Custom',
      activeParticipants: 1,
      joined: true,
      completed: false
    };
    setChallenges([newMission, ...challenges]);
  };

  return (
    <ChallengesContext.Provider value={{ challenges, joinChallenge, completeChallenge, createMission }}>
      {children}
    </ChallengesContext.Provider>
  );
};
