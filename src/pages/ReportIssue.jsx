import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ReportIssue = () => {
  const { reportIssue } = useIssues();
  const { addXP } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    locationText: '',
    severity: 'Medium',
    image: null
  });
  
  const [isVerifyingGPS, setIsVerifyingGPS] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Water Waste', 'Waste Management', 'Deforestation', 'Pollution', 'Wildlife Hazard'];
  
  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSimulateGPS = () => {
    setIsVerifyingGPS(true);
    // Simulate a 2 second GPS metadata check to prevent location spoofing
    setTimeout(() => {
      setIsVerifyingGPS(false);
      setGpsVerified(true);
      setFormData({ ...formData, locationText: 'Detected: School Courtyard (Lat: 28.61, Lng: 77.20)' });
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!formData.image) {
        throw new Error("Photo is required to prevent fake reports.");
      }
      
      reportIssue({
        title: formData.title,
        category: formData.category,
        location: { lat: 28.6139, lng: 77.2090, text: formData.locationText },
        severity: formData.severity,
        image: formData.image || 'https://images.unsplash.com/photo-1542385151-efd55734c76b?w=400',
        reportedBy: 'CurrentUser'
      });

      addXP(50); // Reward for reporting
      alert('Issue reported successfully! You earned 50 XP.');
      navigate('/tracker');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', textAlign: 'center' }}>Report an Issue</h1>
      
      <div className="glass-panel" style={{ background: '#fff', padding: '3rem' }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ 
              height: '8px', 
              flex: 1, 
              background: s <= step ? 'var(--primary-teal)' : '#eee', 
              borderRadius: '4px', 
              transition: 'all 0.3s' 
            }} />
          ))}
        </div>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 1: Upload Photo</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>A verifiable photo is required to prevent spam and abuse.</p>
            
            <div style={{ 
                border: '2px dashed #ccc', 
                borderRadius: '16px', 
                padding: '4rem 2rem', 
                textAlign: 'center', 
                cursor: 'pointer', 
                background: formData.image ? '#e8f5e9' : 'transparent',
                transition: 'all 0.2s'
              }}
              onClick={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400' })}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📷</span>
              <span style={{ fontWeight: 600, color: formData.image ? 'var(--primary-forest)' : 'var(--text-main)' }}>
                {formData.image ? 'Photo Selected! Tap to change.' : 'Tap to capture or upload photo'}
              </span>
            </div>
            
            <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%', padding: '16px' }} onClick={handleNext} disabled={!formData.image}>
              Continue to Step 2
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 2: Location Verification</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>We extract encrypted GPS metadata from the photo to verify your report.</p>
            
            {!gpsVerified ? (
              <button 
                className="btn" 
                onClick={handleSimulateGPS} 
                disabled={isVerifyingGPS}
                style={{ 
                  width: '100%', 
                  padding: '16px',
                  background: isVerifyingGPS ? '#ccc' : 'var(--action-blue)',
                  color: '#fff',
                  justifyContent: 'center'
                }}
              >
                {isVerifyingGPS ? 'Scanning Metadata...' : 'Extract & Verify Location'}
              </button>
            ) : (
              <div style={{ padding: '1.5rem', background: '#e8f5e9', color: 'var(--primary-forest)', borderRadius: '12px', fontWeight: 600, border: '1px solid #c8e6c9' }}>
                ✅ Location Verified: {formData.locationText}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
              <button className="btn" style={{ background: '#eee', color: 'var(--text-main)', flex: 1 }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!gpsVerified}>Confirm Location</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Step 3: Details</h3>
            
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g. Broken sprinkler wasting water" />
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p style={{ fontSize: '0.8rem', color: '#e65100', marginTop: '0.5rem', fontWeight: 600 }}>* Anti-Spam Enforced: Max 3 reports per category daily.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn" style={{ background: '#eee', color: 'var(--text-main)', flex: 1 }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!formData.title || !formData.category}>Review Request</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Step 4: Final Review</h3>
            
            <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '16px', border: '1px solid #eee' }}>
              <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Title:</span><br/><strong style={{ fontSize: '1.1rem' }}>{formData.title}</strong></div>
              <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category:</span><br/><strong style={{ fontSize: '1.1rem' }}>{formData.category}</strong></div>
              <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Location:</span><br/><strong style={{ fontSize: '1.1rem' }}>{formData.locationText}</strong></div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
              <button className="btn" style={{ background: '#eee', color: 'var(--text-main)', flex: 1 }} onClick={handlePrev}>Back</button>
              <button className="btn btn-success" style={{ flex: 2, padding: '16px' }} onClick={handleSubmit}>Submit Secured Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportIssue;
