import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';

const AuthorityDashboard = () => {
  const { issues, updateIssueStatus } = useIssues();
  const [unblurImageIds, setUnblurImageIds] = useState([]);

  // Loophole: Content Moderation. Assume some tag or chance blurred it until clicked.
  // For demo, we just add a "Content Warning" overlay to the first image.
  
  const handleResolve = (id) => {
    updateIssueStatus(id, 'Resolved');
  };

  const handleUnblur = (id) => {
    setUnblurImageIds([...unblurImageIds, id]);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Authority Deck</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review, claim, and dispatch issues reported by students.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {issues.map((issue, idx) => {
          // Fake moderation logic: first issue in the list gets auto-flagged for moderation review
          const isFlagged = idx === 1; 
          const isBlurred = isFlagged && !unblurImageIds.includes(issue.id);

          return (
            <div key={issue.id} className="glass-panel" style={{ background: '#fff', borderLeft: issue.isEscalated ? '5px solid var(--accent-brown)' : '1px solid var(--glass-border)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>{issue.category}</span>
                <span style={{ 
                  color: issue.status === 'Resolved' ? 'var(--primary-forest)' : '#e65100',
                  background: issue.status === 'Resolved' ? '#e8f5e9' : '#fff3e0',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
               }}>{issue.status}</span>
              </div>

              <h3 style={{ marginBottom: '5px' }}>{issue.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>📍 {issue.location.text}</p>

              {/* Moderated Image View */}
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: 'var(--bg-dark)' }}>
                <img 
                  src={issue.image} 
                  alt="Issue Proof" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: isBlurred ? 'blur(15px)' : 'none',
                    transition: 'filter 0.3s'
                  }} 
                />
                
                {isBlurred && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                    <span style={{ fontSize: '2rem' }}>⚠️</span>
                    <p style={{ fontWeight: 'bold', margin: '10px 0' }}>Flagged by Moderation System</p>
                    <button className="btn-primary" style={{ background: 'var(--accent-brown)', padding: '5px 15px' }} onClick={() => handleUnblur(issue.id)}>Click to Reveal</button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {issue.isEscalated && <span style={{ color: '#e65100', fontWeight: 'bold', fontSize: '0.8rem' }}>🔥 ESCALATED</span>}
                  {issue.tags?.includes('Possible Duplicate') && <span style={{ marginLeft: '10px', color: '#c62828', fontWeight: 'bold', fontSize: '0.8rem' }}>⚠️ Duplicate?</span>}
                  {issue.verifications && issue.verifications.length > 0 && <span style={{ marginLeft: '10px', color: 'var(--primary-teal)', fontWeight: 'bold', fontSize: '0.8rem', background: '#e0f2f1', padding: '2px 8px', borderRadius: '50px' }}>👁 {issue.verifications.length} Verifications</span>}
                </div>
                
                {issue.status !== 'Resolved' && (
                  <button className="btn-primary" onClick={() => handleResolve(issue.id)}>Mark Resolved</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
