import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';

// Fix for default Leaflet icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const IssueTracker = () => {
  const { issues, verifyIssue } = useIssues();
  const { user } = useAuth();
  
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
            <MapContainer center={[28.6139, 77.2090]} zoom={16} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues.map(issue => (
                <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]}>
                  <Popup>
                    <strong>{issue.title}</strong><br />
                    Status: {issue.status}<br />
                    <img src={issue.image} alt="Report" style={{ width: '100px', height: 'auto', marginTop: '5px', borderRadius: '4px' }} />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
                  <p style={{ margin: '5px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {issue.location.text} • {issue.category}</p>
                  
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
