import API_BASE_URL from "../config/api";

const getStudentId = () => {
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user._id || user.studentId;
    }
    return null;
};

const studentService = {
  getProfile: async () => {
    const id = getStudentId();
    if (!id) return null;
    const res = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return { ...data, _id: data.id };
  },

  updateProfile: async (formData) => {
    const id = getStudentId();
    if (!id) throw new Error("Not logged in");
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const updated = await res.json();
    const adapted = { ...updated, _id: updated.id };
    
    // Update local storage carefully to not erase token and role
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const newUser = { ...user, ...adapted };
        localStorage.setItem("sc_user", JSON.stringify(newUser));
    }
    
    return adapted;
  },

  uploadProfilePhoto: async (file) => {
    const id = getStudentId();
    if (!id) throw new Error("Not logged in");

    // Upload to file service first
    const formData = new FormData();
    formData.append("files", file);
    const uploadRes = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData
    });
    if (!uploadRes.ok) throw new Error('Failed to upload photo file');
    const filenames = await uploadRes.json();
    const photoUrl = `/api/files/${filenames[0]}`;

    // Connect to Student profile
    await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: photoUrl })
    });

    const updatedProfile = await studentService.getProfile();
    
    // Update local storage carefully to not erase token and role
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const newUser = { ...user, ...updatedProfile };
        localStorage.setItem("sc_user", JSON.stringify(newUser));
    }
    
    return { success: true, profilePicture: photoUrl };
  },

  getAvailableVolunteers: async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/volunteers`);
        if (!response.ok) throw new Error('Failed to fetch available volunteers');
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
  }
};

export default studentService;
