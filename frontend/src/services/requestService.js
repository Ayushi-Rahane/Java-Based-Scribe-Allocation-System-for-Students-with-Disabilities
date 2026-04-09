import API_BASE_URL from "../config/api";

const getStudentId = () => {
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
    }
    return null;
};

// Helper to adapt Spring Boot MongoDB objects to what the React UI expects
const adaptRequest = (r) => {
    return {
        ...r,
        _id: r.id, // Fallback for UI components expecting _id
        status: r.status ? r.status.toLowerCase() : 'pending',
        volunteerId: r.volunteerId ? { fullName: "Assigned Volunteer" } : null 
    };
};

const requestService = {
  getRequests: async () => {
    const studentId = getStudentId();
    if (!studentId) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/requests/student/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch requests');
        const data = await response.json();
        return data
            .map(adaptRequest)
            .filter(r => ['pending', 'matched'].includes(r.status));
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  getHistory: async () => {
    const studentId = getStudentId();
    if (!studentId) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/requests/student/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch requests');
        const data = await response.json();
        return data
            .map(adaptRequest)
            .filter(r => ['completed', 'cancelled'].includes(r.status));
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  createRequest: async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create request');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
  },

  cancelRequest: async (requestId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to cancel request');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
  },

  completeRequest: async (requestId, rating, feedback) => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'COMPLETED', rating, review: feedback })
        });
        if (!response.ok) throw new Error('Failed to complete request');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
  },
};

export default requestService;
