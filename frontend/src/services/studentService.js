import API_BASE_URL from "../config/api";

const getStudentId = () => {
    const userStr = localStorage.getItem('sc_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
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
    
    // Update local storage so page reload stays synced
    localStorage.setItem("sc_user", JSON.stringify(adapted));
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
    localStorage.setItem("sc_user", JSON.stringify(updatedProfile));
    
    return { success: true, profilePicture: photoUrl };
  },

  // Remaining Mock data for volunteers not yet integrated
  getAvailableVolunteers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      {
        _id: "v_001",
        fullName: "Siddharth Malhotra",
        rating: 4.8,
        totalRatings: 12,
        subjects: ["Mathematics", "Physics"],
        languages: ["English", "Hindi"],
        experience: "2 years",
        completedAssignments: 25,
        city: "Mumbai",
        state: "Maharashtra",
      }
    ];
  }
};

export default studentService;
