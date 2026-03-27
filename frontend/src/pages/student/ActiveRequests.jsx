import React, { useState, useEffect } from "react";
import { 
    Trash2, 
    Clock, 
    Calendar, 
    Book, 
    AlertCircle, 
    Loader2, 
    Star, 
    CheckCircle, 
    Library,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import requestService from "../../services/requestService";

const ActiveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completionModal, setCompletionModal] = useState(null); // { requestId, volunteerName }
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    // Fetch requests on component mount
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await requestService.getRequests();

            // Filter out completed and cancelled requests
            const activeRequests = data.filter(
                req => req.status !== 'completed' && req.status !== 'cancelled'
            );

            // Map backend data to component format
            const mappedRequests = activeRequests.map(req => ({
                id: req._id,
                subject: req.subject,
                type: req.examType,
                date: new Date(req.examDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                time: req.examTime,
                duration: req.duration,
                requirements: req.requirements,
                status: mapStatus(req.status),
                volunteer: req.volunteerId?.fullName || null,
                matchProbability: req.status === 'pending' ? 60 : req.status === 'matched' ? 100 : 80,
                notifiedVolunteers: req.status === 'pending' ? 3 : 5
            }));

            setRequests(mappedRequests);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError(err.message || "Failed to load requests");
            setLoading(false);
        }
    };

    // Map backend status to display status
    const mapStatus = (backendStatus) => {
        const statusMap = {
            'pending': 'Matching in Progress',
            'matched': 'Matched',
            'in-progress': 'Matched'
        };
        return statusMap[backendStatus] || 'Pending';
    };

    const handleDelete = async (id) => {
        try {
            await requestService.cancelRequest(id);
            setRequests(requests.filter(req => req.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Error deleting request:", err);
            alert("Failed to cancel request: " + err.message);
        }
    };

    const handleCompleteRequest = async () => {
        if (rating === 0) {
            alert("Please provide a rating before completing");
            return;
        }

        try {
            await requestService.completeRequest(completionModal.requestId, rating, feedback);
            // Remove from active requests list
            setRequests(requests.filter(req => req.id !== completionModal.requestId));
            // Close modal and reset
            setCompletionModal(null);
            setRating(0);
            setFeedback('');
        } catch (err) {
            console.error("Error completing request:", err);
            alert("Failed to complete request: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <StudentSidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Top bar */}
                <div className="h-16 border-b bg-white flex items-center px-6 md:px-10 sticky top-0 z-20">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest pl-10 md:pl-0">Active Requests</span>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    {/* Header */}
                    <div className="max-w-6xl mx-auto mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Requests</h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-13">
                            Manage your pending and matched scribe requests in real-time.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-8 bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-3xl flex items-center gap-4 animate-fadeIn">
                                <AlertCircle size={24} />
                                <div className="flex-1">
                                    <p className="font-bold">Error loading requests</p>
                                    <p className="text-sm opacity-90">{error}</p>
                                </div>
                                <button
                                    onClick={fetchRequests}
                                    className="bg-white text-rose-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:bg-rose-100 transition-all"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm animate-fadeIn">
                                <Loader2 className="animate-spin text-indigo-600 mx-auto mb-6" size={48} />
                                <p className="text-slate-500 font-bold tracking-tight">Syncing your active requests...</p>
                            </div>
                        ) : (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <StatCard title="Total Active" value={requests.length} color="indigo" icon={<Clock size={20} />} />
                                    <StatCard
                                        title="In Matching"
                                        value={requests.filter(r => r.status === "Matching in Progress").length}
                                        color="amber"
                                        icon={<Loader2 size={20} className="animate-spin-slow" />}
                                    />
                                    <StatCard
                                        title="Matched"
                                        value={requests.filter(r => r.status === "Matched").length}
                                        color="emerald"
                                        icon={<CheckCircle size={20} />}
                                    />
                                </div>

                                {/* Requests List */}
                                <div className="space-y-6">
                                    {requests.length === 0 ? (
                                        <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm animate-fadeIn">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                                <Library className="text-slate-200" size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-400 mb-2">No Active Requests</h3>
                                            <p className="text-slate-400 font-medium max-w-xs mx-auto">You don't have any active scribe requests at the moment.</p>
                                        </div>
                                    ) : (
                                        requests.map((request) => (
                                            <RequestCard
                                                key={request.id}
                                                request={request}
                                                onDelete={() => setDeleteConfirm(request.id)}
                                                deleteConfirm={deleteConfirm === request.id}
                                                onConfirmDelete={() => handleDelete(request.id)}
                                                onCancelDelete={() => setDeleteConfirm(null)}
                                                onComplete={() => setCompletionModal({ requestId: request.id, volunteerName: request.volunteer })}
                                            />
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {completionModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
                    <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-3xl border border-slate-100 animate-scaleIn relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Complete Request</h3>
                                <p className="text-slate-500 font-medium">
                                    Finalize your session with <span className="text-indigo-600 font-bold">{completionModal.volunteerName}</span>
                                </p>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-8">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">How was your experience? <span className="text-indigo-600">*</span></label>
                            <div className="flex gap-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-all duration-300 transform hover:scale-125 ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}
                                    >
                                        <Star size={40} fill={star <= rating ? "currentColor" : "none"} strokeWidth={2.5} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="mb-8">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Feedback (Optional)</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your experience with this volunteer..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 resize-none min-h-[120px]"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setCompletionModal(null);
                                    setRating(0);
                                    setFeedback('');
                                }}
                                className="flex-1 px-4 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompleteRequest}
                                className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                            >
                                Submit & Finish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* -------------------- Components -------------------- */

const StatCard = ({ title, value, color, icon }) => {
    const variants = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group hover:border-indigo-100 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${variants[color]}`}>
                {icon}
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 leading-tight">{value}</h3>
        </div>
    );
};

const RequestCard = ({ request, onDelete, deleteConfirm, onConfirmDelete, onCancelDelete, onComplete }) => {
    const statusConfig = {
        "Matching in Progress": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
        "Pending": { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
        "Matched": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
    };

    const statusStyle = statusConfig[request.status] || statusConfig.Pending;

    return (
        <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-600/5 transition-all animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-8 border-b bg-slate-50/50 gap-4">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[22px] bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">
                        {request.subject.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{request.subject}</h3>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{request.type}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {request.status}
                    </span>

                    {!deleteConfirm ? (
                        <button
                            onClick={onDelete}
                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                            title="Cancel Request"
                        >
                            <Trash2 size={20} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 animate-slide-in">
                            <button
                                onClick={onCancelDelete}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                            >
                                Keep
                            </button>
                            <button
                                onClick={onConfirmDelete}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all"
                            >
                                Cancel Request
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <InfoItem icon={<Calendar size={16} />} label="Exam Date" value={request.date} />
                    <InfoItem icon={<Clock size={16} />} label="Start Time" value={request.time} />
                    <InfoItem icon={<Clock size={16} />} label="Duration" value={request.duration + " Hours"} />
                    {request.volunteer && (
                        <InfoItem icon={<ShieldCheck size={16} />} label="Assigned Volunteer" value={request.volunteer} />
                    )}
                </div>

                {/* Progress Bar (for matching requests) */}
                {request.status === "Matching in Progress" && (
                    <div className="mt-8 bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin text-indigo-600" size={14} />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Finding Best Match</p>
                            </div>
                            <p className="text-sm font-black text-indigo-600">{request.matchProbability}%</p>
                        </div>
                        <div className="h-2.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                style={{ width: `${request.matchProbability}%` }}
                            />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-3 flex items-center gap-2">
                             <TrendingUp size={12} />
                             {request.notifiedVolunteers} qualified volunteers notified in your area
                        </p>
                    </div>
                )}

                {/* Matched Info */}
                {request.status === "Matched" && (
                    <div className="mt-8">
                        <div className="bg-indigo-50 border border-indigo-100/50 rounded-[28px] p-6 mb-6 flex items-start gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
                                <ShieldCheck className="text-indigo-600" size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-900 mb-1">
                                    Matched with {request.volunteer}
                                </p>
                                <p className="text-xs font-semibold text-indigo-700/70 leading-relaxed">
                                    A qualified scribe has accepted your request. We've notified them and they'll be at the venue on time.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onComplete}
                            className="w-full bg-indigo-600 text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98]"
                        >
                            Mark Session as Complete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">{value}</p>
        </div>
    </div>
);

export default ActiveRequests;
