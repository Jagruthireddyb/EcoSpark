import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (New Delhi)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const IssueTracker = () => {
  const { issues, verifyIssue } = useIssues();
  const { user } = useAuth();
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCBt-AhXTNFnNuNkxT_8_Bp14n8IirlCb8"
  });

  const [selectedIssue, setSelectedIssue] = useState(null);

  let dynamicCenter = defaultCenter;
  if (issues && issues.length > 0 && issues[0].location && !isNaN(issues[0].location.lat) && !isNaN(issues[0].location.lng)) {
    // Center map on the most recent issue accurately even if lat/lng are stored as strings
    dynamicCenter = { 
      lat: Number(issues[0].location.lat), 
      lng: Number(issues[0].location.lng) 
    };
  }
  
  const handleVerify = (id) => {
    if (!user) return alert('Must log in to verify');
    const escalated = verifyIssue(id, user.username);
    if (escalated) {
      alert("Swarm validation reached 3+! This issue has been instantly escalated to the Authority Deck.");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Issue Tracker Map</h1>
      
      <div style={{ display: 'flex', gap: '2rem', height: '600px', flexWrap: 'wrap' }}>
        {/* Map View */}
        <div className="glass-panel" style={{ flex: 2, minWidth: '400px', padding: '10px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden' }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={dynamicCenter}
                zoom={14}
              >
                {issues.map(issue => {
                  if (!issue || !issue.location || isNaN(issue.location.lat) || isNaN(issue.location.lng)) {
                    return null; // Skip corrupted location data gracefully
                  }
                  return (
                    <MarkerF 
                      key={issue.id} 
                      position={{lat: Number(issue.location.lat), lng: Number(issue.location.lng)}}
                      onClick={() => setSelectedIssue(issue)}
                    />
                  );
                })}
                {selectedIssue && !isNaN(selectedIssue.location?.lat) && (
                  <InfoWindowF
                    position={{lat: Number(selectedIssue.location.lat), lng: Number(selectedIssue.location.lng)}}
                    onCloseClick={() => setSelectedIssue(null)}
                  >
                    <div>
                      <strong>{selectedIssue.title}</strong><br />
                      Status: {selectedIssue.status}<br />
                      <img src={selectedIssue.image} alt="Report" style={{ width: '100px', height: 'auto', marginTop: '5px', borderRadius: '4px' }} />
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            ) : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading Map...</div>}
          </div>
        </div>

        {/* List View */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '300px', background: '#fff', overflowY: 'auto', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-forest)' }}>Activity Feed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {issues.map(issue => {
               const alreadyVerified = user && issue.verifications?.includes(user.username);
               const verificationCount = issue.verifications?.length || 0;

               return (
                <div key={issue.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '12px', background: 'var(--bg-dark)' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{issue.title}</h4>
                  <p style={{ margin: '5px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {issue.location?.text || 'Unknown Location'} • {issue.category}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: issue.status === 'Resolved' ? '#e8f5e9' : '#fff3e0', color: issue.status === 'Resolved' ? 'var(--primary-forest)' : '#f57c00', fontWeight: 'bold' }}>
                      {issue.status}
                    </span>
                    {issue.tags && issue.tags.includes('Possible Duplicate') && (
                      <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#ffebee', color: '#c62828', fontWeight: 'bold' }}>
                        Duplicate?
                      </span>
                    )}
                    {issue.isEscalated && (
                      <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#e65100', color: '#fff', fontWeight: 'bold' }}>
                        🔥 Escalated
                      </span>
                    )}
                  </div>

                  {issue.status === 'Pending' && !issue.isEscalated && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 'bold' }}>
                        👁 {verificationCount}/3 Verified
                      </span>
                      <button 
                        onClick={() => handleVerify(issue.id)}
                        disabled={alreadyVerified}
                        className="btn"
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '0.85rem', 
                          background: alreadyVerified ? '#ccc' : 'var(--action-blue)', 
                          color: '#fff' 
                        }}>
                        {alreadyVerified ? 'Verified' : 'I see it too!'}
                      </button>
                    </div>
                  )}
                  {issue.status === 'Pending' && issue.isEscalated && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', fontSize: '0.8rem', color: '#e65100', fontWeight: 'bold' }}>
                      Verified by Swarm & Sent to Authority
                    </div>
                  )}
                </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueTracker;
