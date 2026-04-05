import React, { createContext, useContext, useState, useEffect } from 'react';

const IssuesContext = createContext();

export const useIssues = () => useContext(IssuesContext);

export const IssuesProvider = ({ children }) => {
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('ecospark_issues');
    if (saved) return JSON.parse(saved);
    
    // Seed some mock data
    return [
      {
        id: '1',
        title: 'Leaking Pipe in Block B',
        category: 'Water Waste',
        location: { lat: 28.6139, lng: 77.2090, text: 'Block B Restroom' },
        severity: 'High',
        status: 'Pending',
        reportedBy: 'student1',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago (will auto-escalate)
        isEscalated: false,
        verifications: ['student2'],
        image: 'https://images.unsplash.com/photo-1542385151-efd55734c76b?w=400'
      },
      {
        id: '2',
        title: 'Litter near Cafeteria',
        category: 'Waste Management',
        location: { lat: 28.6140, lng: 77.2085, text: 'Cafeteria South' },
        severity: 'Low',
        status: 'Resolved',
        reportedBy: 'student2',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
        isEscalated: false,
        verifications: [],
        image: 'https://images.unsplash.com/photo-1595278069441-2f29f7f35913?w=400'
      }
    ];
  });

  const [spamTracker, setSpamTracker] = useState(() => {
    const saved = localStorage.getItem('ecospark_spam_tracker');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Auto-escalation loop: check issues older than 7 days
    const updatedIssues = issues.map(issue => {
      if (issue.status === 'Pending' && !issue.isEscalated) {
        const daysOld = (Date.now() - issue.timestamp) / (1000 * 60 * 60 * 24);
        if (daysOld >= 7) {
          return { ...issue, isEscalated: true };
        }
      }
      return issue;
    });

    if (JSON.stringify(updatedIssues) !== JSON.stringify(issues)) {
      setIssues(updatedIssues);
    }

    localStorage.setItem('ecospark_issues', JSON.stringify(issues));
    localStorage.setItem('ecospark_spam_tracker', JSON.stringify(spamTracker));
  }, [issues, spamTracker]);

  const reportIssue = (newIssue) => {
    const today = new Date().toISOString().split('T')[0];
    const categoryCount = spamTracker[today]?.[newIssue.category] || 0;

    // Loophole validation: max 3 per category per day
    if (categoryCount >= 3) {
      throw new Error(`Anti-Spam active: You have reported maximum (3) issues for ${newIssue.category} today. Please wait 24 hours.`);
    }

    // Duplicate logic: Is there already a pending issue near this location with same category? (Simulated)
    const isDuplicate = issues.some(i => i.category === newIssue.category && i.status === 'Pending' && i.location.text === newIssue.location.text);
    
    if (isDuplicate) {
        newIssue.tags = ['Possible Duplicate'];
    }

    const issueWithMeta = {
      ...newIssue,
      id: Date.now().toString(),
      status: 'Pending',
      timestamp: Date.now(),
      isEscalated: false,
      verifications: []
    };

    setIssues([issueWithMeta, ...issues]);

    // Update spam tracker
    setSpamTracker(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        [newIssue.category]: categoryCount + 1
      }
    }));
    
    return issueWithMeta;
  };

  const updateIssueStatus = (id, newStatus) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const verifyIssue = (id, userId) => {
    let escalatedStatusChanged = false;
    
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        const currentVerifiers = issue.verifications || [];
        if (currentVerifiers.includes(userId)) return issue;
        
        const updatedVerifiers = [...currentVerifiers, userId];
        const escalated = updatedVerifiers.length >= 3 || issue.isEscalated;
        
        if (escalated && !issue.isEscalated) {
           escalatedStatusChanged = true;
        }

        return { 
          ...issue, 
          verifications: updatedVerifiers, 
          isEscalated: escalated,
          tags: issue.tags ? issue.tags.filter(t => t !== 'Possible Duplicate') : []
        };
      }
      return issue;
    }));
    
    return escalatedStatusChanged;
  };

  return (
    <IssuesContext.Provider value={{ issues, reportIssue, updateIssueStatus, verifyIssue }}>
      {children}
    </IssuesContext.Provider>
  );
};
