import React, { createContext, useContext, useState, useEffect } from 'react';
import { issuesAPI } from '../api/issues';

const IssuesContext = createContext();

export const useIssues = () => useContext(IssuesContext);

// Map backend status → frontend status labels
const mapStatus = (s) => {
  if (s === 'RESOLVED') return 'Resolved';
  if (s === 'ASSIGNED') return 'In Progress';
  return 'Pending';
};

// Map backend category → frontend category
const mapCategory = (c) => {
  const map = {
    WASTE: 'Waste Management',
    WATER: 'Water Waste',
    AIR: 'Pollution',
    DEFORESTATION: 'Deforestation',
    WILDLIFE: 'Wildlife Hazard',
    OTHER: 'Other',
  };
  return map[c] || c;
};

// Map frontend category → backend category enum
const mapCategoryToAPI = (c) => {
  const map = {
    'Waste Management': 'WASTE',
    'Water Waste': 'WATER',
    'Pollution': 'AIR',
    'Deforestation': 'DEFORESTATION',
    'Wildlife Hazard': 'WILDLIFE',
    'Other': 'OTHER',
  };
  return map[c] || 'OTHER';
};

export const IssuesProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch issues from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issuesAPI.list();
      // Normalize backend shape → frontend shape
      const normalized = data.map(issue => ({
        id: issue.id,
        title: issue.title,
        category: mapCategory(issue.category),
        location: {
          lat: issue.latitude || 28.6139,
          lng: issue.longitude || 77.2090,
          text: issue.description || 'Location not specified',
        },
        severity: 'Medium',
        status: mapStatus(issue.status),
        reportedBy: issue.user_id,
        timestamp: new Date(issue.created_at).getTime(),
        isEscalated: issue.status === 'ASSIGNED',
        verifications: [],
        image: issue.images?.[0]?.image_url || null,
        raw: issue,
      }));
      setIssues(normalized);
    } catch (err) {
      console.error('Failed to fetch issues:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const reportIssue = async (newIssue) => {
    const apiCategory = mapCategoryToAPI(newIssue.category);
    const created = await issuesAPI.create(
      newIssue.title,
      newIssue.location?.text || '',
      apiCategory,
      newIssue.location?.lat || null,
      newIssue.location?.lng || null,
    );

    // If there's an image file, upload it right after creating
    if (newIssue.imageFile) {
      await issuesAPI.uploadImage(created.id, newIssue.imageFile);
    }

    // Refresh list from backend so UI stays in sync
    await fetchIssues();
    return created;
  };

  const updateIssueStatus = async (id, newStatus) => {
    // Map frontend status → backend action
    if (newStatus === 'Resolved') {
      await issuesAPI.resolve(id);
      await fetchIssues();
    }
  };

  // Keep local-only verify for now (backend doesn't have a verify endpoint yet)
  const verifyIssue = (id, userId) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== id) return issue;
      const current = issue.verifications || [];
      if (current.includes(userId)) return issue;
      const updated = [...current, userId];
      return { ...issue, verifications: updated, isEscalated: updated.length >= 3 };
    }));
  };

  return (
    <IssuesContext.Provider value={{ issues, loading, reportIssue, updateIssueStatus, verifyIssue, fetchIssues }}>
      {children}
    </IssuesContext.Provider>
  );
};
