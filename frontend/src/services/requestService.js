// Mock Request Service
const requestService = {
  getRequests: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
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

  getHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      {
        _id: "hist_001",
        subject: "Calculus",
        examName: "Internal Exam",
        examDate: "2025-10-10T10:00:00.000Z",
        status: "completed",
        rating: 5,
        review: "Excellent scribe!",
        createdAt: "2025-10-01T09:00:00.000Z",
      },
      {
        _id: "hist_002",
        subject: "Physics",
        examName: "Final Viva",
        examDate: "2025-09-28T09:00:00.000Z",
        status: "completed",
        rating: 4,
        review: "Good experience.",
        createdAt: "2025-09-15T10:00:00.000Z",
      },
    ];
  },

  createRequest: async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Creating request:", formData);
    return { success: true, id: "req_" + Date.now() };
  },

  cancelRequest: async (requestId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Cancelling request: ${requestId}`);
    return { success: true };
  },

  completeRequest: async (requestId, rating, feedback) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log(`Completing request ${requestId} with rating ${rating} and feedback: ${feedback}`);
    return { success: true };
  },
};

export default requestService;
