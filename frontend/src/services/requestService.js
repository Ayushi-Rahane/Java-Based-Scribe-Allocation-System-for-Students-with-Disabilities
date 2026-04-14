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
        _id: r.id,
        status: r.status ? r.status.toLowerCase() : 'pending',
        volunteerIdRaw: r.volunteerId || null,
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
        const active = data
            .map(adaptRequest)
            .filter(r => ['pending', 'accepted'].includes(r.status));

        // For accepted requests, resolve the volunteer name from their profile
        const withVolunteer = await Promise.all(active.map(async (req) => {
            if (req.status === 'accepted' && req.volunteerIdRaw) {
                try {
                    const vRes = await fetch(`${API_BASE_URL}/volunteers/${req.volunteerIdRaw}/profile`);
                    if (vRes.ok) {
                        const v = await vRes.json();
                        return { ...req, volunteerName: v.fullName, volunteerPhone: v.phone, volunteerRating: v.rating };
                    }
                } catch (_) {}
            }
            return req;
        }));
        return withVolunteer;
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
        const histItems = data
            .map(adaptRequest)
            .filter(r => ['completed', 'cancelled'].includes(r.status));

        // Resolve volunteer name for completed items
        const withVolunteer = await Promise.all(histItems.map(async (req) => {
            if (req.volunteerIdRaw) {
                try {
                    const vRes = await fetch(`${API_BASE_URL}/volunteers/${req.volunteerIdRaw}/profile`);
                    if (vRes.ok) {
                        const v = await vRes.json();
                        return { ...req, volunteerName: v.fullName };
                    }
                } catch (_) {}
            }
            return req;
        }));
        return withVolunteer;
    } catch (err) {
        console.error(err);
        return [];
    }
  },

  createRequest: async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create request');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
  },

  uploadMaterials: async (files) => {
    if (!files || files.length === 0) return [];
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    try {
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload files');
        return await response.json();
    } catch (err) {
        console.error("Error uploading materials:", err);
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

  /**
   * Completes a session:
   *   Step 1 — Marks request COMPLETED (also increments volunteer session count via backend)
   *   Step 2 — Submits student rating+review to update volunteer's rolling average
   */
  completeRequest: async (requestId, rating, feedback) => {
    try {
        // Step 1: mark COMPLETED
        const statusRes = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'COMPLETED' })
        });
        if (!statusRes.ok) throw new Error('Failed to complete request');

        // Step 2: submit rating to volunteer profile
        const rateRes = await fetch(`${API_BASE_URL}/volunteers/rate/${requestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, review: feedback })
        });
        // Don't throw on rate failure — the session is already marked complete
        if (!rateRes.ok) {
            console.warn('Rating submission failed, but session was marked complete.');
        }

        return await statusRes.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
  },
};

export default requestService;
