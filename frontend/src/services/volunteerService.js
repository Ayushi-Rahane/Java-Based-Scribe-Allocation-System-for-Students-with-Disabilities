import API_BASE_URL from "../config/api";

const getVolunteerId = () => {
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user._id || user.volunteerId;
    }
    return null;
};

// Map backend Request format to frontend mock format to minimize UI churn where possible
const adaptMatchedRequest = (item) => {
    const r = item.request;
    return {
        id: r.id,
        _id: r.id,
        studentName: r.studentName || "Student",
        subject: r.subject || "General",
        disability: r.disabilityType || r.disability || "Not specified",
        language: r.language || r.preferredLanguage || "English",
        examDate: r.examDate || "TBA",
        examTime: r.time || r.examTime || "TBA",
        duration: r.duration || "N/A",
        city: r.city || "Unknown",
        matchScore: item.matchScore || 0,
        postedAt: r.createdAt || new Date().toISOString(),
        notes: r.specificNeeds || r.notes || "",
        materials: r.materials || []
    };
};

const volunteerService = {
  getProfile: async () => {
    const id = getVolunteerId();
    if (!id) return null;
    try {
        const response = await fetch(`${API_BASE_URL}/volunteers/${id}/profile`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
  },

  getMatchedRequests: async () => {
    const id = getVolunteerId();
    if (!id) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/volunteers/${id}/matched-requests`);
        if (!response.ok) throw new Error('Failed to fetch matched requests');
        const data = await response.json();
        
        // Backend returns: { totalMatches: int, requests: [ { request: {...}, matchScore: double } ] }
        if (data && data.requests) {
            return data.requests.map(adaptMatchedRequest);
        }
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  acceptRequest: async (requestId) => {
    const id = getVolunteerId();
    if (!id) throw new Error('Not logged in');

    try {
        const response = await fetch(`${API_BASE_URL}/volunteers/accept/${requestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ volunteerId: id })
        });
        if (!response.ok) throw new Error('Failed to accept request');
        return { success: true, data: await response.json() };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
  },
  
  declineRequest: async (requestId) => {
    // No explicit backend decline endpoint — just remove from UI list
    return { success: true };
  },

  getActiveAssignments: async () => {
    const id = getVolunteerId();
    if (!id) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/volunteers/${id}/active`);
        if (!response.ok) throw new Error('Failed to fetch active assignments');
        const data = await response.json();
        return data.activeAssignments || [];
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  getHistory: async () => {
    const id = getVolunteerId();
    if (!id) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/volunteers/${id}/history`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        return data.history || [];
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  getCertificate: async () => {
    const id = getVolunteerId();
    if (!id) return null;
    try {
        // Trigger recalculation first to ensure rating data is accurate
        await fetch(`${API_BASE_URL}/volunteers/${id}/recalculate-rating`, {
            method: 'POST'
        }).catch(() => {}); // Silently ignore if endpoint doesn't exist yet
        
        const response = await fetch(`${API_BASE_URL}/volunteers/${id}/certificate`);
        if (!response.ok) throw new Error('Failed to fetch certificate');
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
  },
};

export default volunteerService;
