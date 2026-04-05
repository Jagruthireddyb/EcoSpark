import React, { useState, useRef, useEffect } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';

const ReportIssue = () => {
  const { reportIssue } = useIssues();
  const { addXP } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    locationText: '',
    latitude: null,
    longitude: null,
    severity: 'Medium',
    image: null,
    imageFile: null
  });
  
  const [isVerifyingGPS, setIsVerifyingGPS] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Water Waste', 'Waste Management', 'Deforestation', 'Pollution', 'Wildlife Hazard'];
  
  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  // Get real-time location from device GPS
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsVerifyingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          locationText: `📍 Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Accuracy: ±${Math.round(accuracy)}m)`
        }));
        setIsVerifyingGPS(false);
        setGpsVerified(true);
      },
      (error) => {
        setIsVerifyingGPS(false);
        let errorMsg = 'Could not get location. ';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg += 'Please enable location services.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg += 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg += 'Location request timed out.';
        }
        setError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Initialize map when step 2 is reached
  useEffect(() => {
    if (step === 2 && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([28.6139, 77.2090], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Current location marker
      const currentMarker = L.marker([28.6139, 77.2090], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      }).addTo(map);
      currentMarker.bindPopup('Default location (28.61°N, 77.21°E)');

      // Click handler to set location
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove old marker if exists
        if (mapInstanceRef.current?.selectedMarker) {
          map.removeLayer(mapInstanceRef.current.selectedMarker);
        }

        // Add new marker
        const selectedMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            className: 'selected-location-marker'
          })
        }).addTo(map);
        selectedMarker.bindPopup(`Selected: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`).openPopup();

        // Update form data
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationText: `📍 Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        }));
        setGpsVerified(false); // Mark as manually selected, not GPS

        if (mapInstanceRef.current) {
          mapInstanceRef.current.selectedMarker = selectedMarker;
        }
      });

      mapInstanceRef.current = { map, selectedMarker: null };
    }

    return () => {
      if (step !== 2 && mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.image) {
        throw new Error("Photo is required to prevent fake reports.");
      }
      if (!formData.latitude || !formData.longitude) {
        throw new Error("Location is required. Please verify location on the map.");
      }

      await reportIssue({
        title: formData.title,
        category: formData.category,
        location: { lat: formData.latitude, lng: formData.longitude, text: formData.locationText },
        severity: formData.severity,
        imageFile: formData.imageFile || null,   // real File object for upload
        image: formData.image,                   // preview URL for UI
        reportedBy: 'CurrentUser'
      });

      addXP(50);
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
              onClick={() => document.getElementById('photo-input').click()}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📷</span>
              <span style={{ fontWeight: 600, color: formData.image ? 'var(--primary-forest)' : 'var(--text-main)' }}>
                {formData.image ? 'Photo Selected! Tap to change.' : 'Tap to capture or upload photo'}
              </span>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      imageFile: file,
                      image: URL.createObjectURL(file),
                    });
                  }
                }}
              />
            </div>
            
            <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%', padding: '16px' }} onClick={handleNext} disabled={!formData.image}>
              Continue to Step 2
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 2: Verify Location</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Use your device's GPS or click on the map to select the exact location of the issue.</p>
            
            {/* GPS Button */}
            <button
              className="btn"
              onClick={handleGetCurrentLocation}
              disabled={isVerifyingGPS}
              style={{
                width: '100%',
                padding: '14px 16px',
                marginBottom: '1.5rem',
                background: isVerifyingGPS ? '#ccc' : '#4CAF50',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: isVerifyingGPS ? 'not-allowed' : 'pointer',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>📍</span>
              {isVerifyingGPS ? 'Getting Location...' : 'Use Current Location'}
            </button>

            {/* Status Message */}
            {gpsVerified && (
              <div style={{ padding: '1rem', background: '#e8f5e9', color: 'var(--primary-forest)', borderRadius: '12px', fontWeight: 600, border: '1px solid #c8e6c9', marginBottom: '1.5rem' }}>
                ✅ {formData.locationText}
              </div>
            )}

            {/* Map for manual selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Or click on the map below to manually select a location:
              </p>
              <div 
                ref={mapRef}
                style={{ 
                  width: '100%', 
                  height: '350px', 
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }} 
              />
            </div>

            {formData.locationText && !gpsVerified && (
              <div style={{ padding: '1rem', background: '#e3f2fd', color: '#1976d2', borderRadius: '12px', fontWeight: 600, border: '1px solid #90caf9', marginBottom: '1.5rem' }}>
                ✓ {formData.locationText}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn" style={{ background: '#eee', color: 'var(--text-main)', flex: 1 }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!formData.locationText}>Confirm Location</button>
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
