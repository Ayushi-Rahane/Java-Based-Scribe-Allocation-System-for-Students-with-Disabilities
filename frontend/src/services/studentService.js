// Mock Student Service
const studentService = {
  getProfile: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      fullName: "Anjali Rao",
      email: "anjali.rao@example.com",
      profilePicture: null,
      university: "Mumbai University",
      course: "B.A. English Literature",
    };
  },

  getRequests: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      {
        _id: "req_001",
        subject: "English Literature",
        examName: "Semester Final",
        examDate: "2025-11-12T10:00:00.000Z",
        status: "matched",
        duration: 3,
        language: "English",
        location: "Hall A, Mumbai University",
        volunteerId: { fullName: "Aryan Mehta" },
        materials: ["syllabus_lit.pdf"],
        createdAt: "2025-11-05T09:00:00.000Z",
      },
      {
        _id: "req_002",
        subject: "History",
        examName: "Mid-Term",
        examDate: "2025-11-20T11:00:00.000Z",
        status: "pending",
        duration: 2,
        language: "Hindi",
        location: "Room 102, Arts Building",
        materials: [],
        createdAt: "2025-11-07T14:30:00.000Z",
      },
    ];
  },

  uploadRequestMaterials: async (requestId, file) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Uploading ${file.name} for request ${requestId}`);
    return { success: true };
  },

  deleteRequestMaterial: async (requestId, filename) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Deleting ${filename} from request ${requestId}`);
    return { success: true };
  },

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
        volunteerType: "free",
        city: "Mumbai",
        state: "Maharashtra",
        availability: { monday: { morning: true, afternoon: true }, wednesday: { evening: true } },
      },
      {
        _id: "v_002",
        fullName: "Priya Sharma",
        rating: 4.9,
        totalRatings: 8,
        subjects: ["English Literature", "History"],
        languages: ["English", "Marathi"],
        experience: "1 year",
        completedAssignments: 15,
        volunteerType: "free",
        city: "Pune",
        state: "Maharashtra",
        availability: { tuesday: { morning: true }, thursday: { afternoon: true } },
      },
      {
        _id: "v_003",
        fullName: "Rahul Verma",
        rating: 4.7,
        totalRatings: 20,
        subjects: ["Computer Science", "Economics"],
        languages: ["English", "Hindi", "Telugu"],
        experience: "3 years",
        completedAssignments: 55,
        volunteerType: "paid",
        hourlyRate: 200,
        city: "Bangalore",
        state: "Karnataka",
        availability: { saturday: { morning: true }, sunday: { morning: true } },
      },
    ];
  },

  updateProfile: async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Updating profile with:", formData);
    return { success: true };
  },

  uploadProfilePhoto: async (file) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Uploading profile photo:", file.name);
    return { success: true, profilePicture: "/uploads/profile_new.jpg" };
  },
};

export default studentService;
