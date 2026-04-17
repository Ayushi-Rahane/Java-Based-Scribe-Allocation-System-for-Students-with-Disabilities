import React, { useState, useEffect } from "react";
import { 
    History as HistoryIcon, 
    Star, 
    Calendar, 
    Clock, 
    BookOpen, 
    CheckCircle2, 
    XCircle, 
    FileText, 
    TrendingUp,
    ShieldCheck,
    Loader2
} from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import requestService from "../../services/requestService";

const History = () => {
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await requestService.getHistory();
            setCompletedRequests(data);
        } catch (err) {
            console.error("Error fetching history:", err);
            setError(err.message || "Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <StudentSidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="h-16 border-b bg-white flex items-center px-6 md:px-10 sticky top-0 z-20">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest pl-10 md:pl-0">Request History</span>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    {/* Header */}
                    <div className="max-w-6xl mx-auto mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <HistoryIcon size={20} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Milestone History</h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-13">A complete archive of your completed and cancelled scribe requests.</p>
                    </div>

                    {/* Content */}
                    <div className="max-w-6xl mx-auto">
                        {/* Loading State */}
                        {loading && (
                            <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm animate-fadeIn">
                                <Loader2 className="animate-spin text-indigo-600 mx-auto mb-6" size={48} />
                                <p className="text-slate-500 font-bold tracking-tight">Syncing your activity archive...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-3xl mb-8 flex items-center gap-4">
                                <ShieldCheck size={24} />
                                <div>
                                    <p className="font-bold">Error loading history</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <StatCard
                                        title="Total Requests"
                                        value={completedRequests.length}
                                        color="indigo"
                                        icon={<BookOpen size={20} />}
                                    />
                                    <StatCard
                                        title="Completed"
                                        value={completedRequests.filter(r => r.status === 'completed').length}
                                        color="emerald"
                                        icon={<CheckCircle2 size={20} />}
                                    />
                                    <StatCard
                                        title="Cancelled"
                                        value={completedRequests.filter(r => r.status === 'cancelled').length}
                                        color="rose"
                                        icon={<XCircle size={20} />}
                                    />
                                </div>

                                {/* Request Summary List */}
                                {completedRequests.length > 0 ? (
                                    <div className="space-y-6">
                                        {completedRequests.map(request => (
                                            <HistoryRequestCard
                                                key={request._id}
                                                request={request}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                            <HistoryIcon className="text-slate-200" size={40} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-400 mb-2 tracking-tight">Archive Empty</h3>
                                        <p className="text-slate-400 font-medium">Your completed and cancelled requests will appear here once archived.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------------- Stat Card Component ---------------- */

const StatCard = ({ title, value, color, icon }) => {
    const variants = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group hover:border-indigo-100 transition-all flex items-center gap-6">
            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110 ${variants[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 leading-tight">{value}</p>
            </div>
        </div>
    );
};

/* ---------------- Request Card Component ---------------- */

const HistoryRequestCard = ({ request, formatDate }) => {
    const statusColors = {
        'completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'cancelled': 'bg-rose-50 text-rose-700 border-rose-100'
    };

    const statusText = {
        'completed': 'Completed Successfuly',
        'cancelled': 'Request Cancelled'
    };

    const volunteerName = request.volunteerName || 'No volunteer assigned';
    const initials = volunteerName !== 'No volunteer assigned'
        ? volunteerName.split(' ').map(n => n[0]).join('').toUpperCase()
        : '?';

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all group animate-fadeIn">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                {/* Information Cluster */}
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-8">
                    {/* Volunteer Identity (if exists) */}
                    {request.volunteerId ? (
                        <div className="w-16 h-16 rounded-[24px] bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-600/20 shrink-0">
                            {initials}
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-[24px] bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center shrink-0">
                            <XCircle size={32} strokeWidth={1} />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{request.subject}</h3>
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${statusColors[request.status]}`}>
                                {statusText[request.status]}
                            </span>
                        </div>
                        
                        <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-2">
                            {request.volunteerId ? (
                                <>Assisted by <span className="text-indigo-600 font-bold">{volunteerName}</span></>
                            ) : (
                                <span className="opacity-60">System Cancelled (No Match Found)</span>
                            )}
                        </p>

                        {/* Detail Pills */}
                        <div className="flex flex-wrap gap-3">
                            <DetailPill icon={BookOpen} label={request.examType} />
                            <DetailPill icon={Calendar} label={formatDate(request.examDate)} />
                            <DetailPill icon={Clock} label={`${request.examTime} (${request.duration}h)`} />
                        </div>
                    </div>
                </div>

                {/* Rating & Action Section */}
                {request.status === 'completed' && (
                    <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3 bg-slate-50 p-6 rounded-[30px] border border-slate-100 lg:bg-transparent lg:p-0 lg:border-0 lg:rounded-none lg:mt-0 mt-4">
                        <div className="flex flex-col items-center lg:items-end gap-1.5 ">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Performance Rating</p>
                            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-2xl shadow-sm lg:shadow-none border border-slate-100 lg:border-0">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={i < (request.rating || 0) ? "text-amber-400" : "text-slate-100"}
                                        fill={i < (request.rating || 0) ? "currentColor" : "none"}
                                        size={18}
                                        strokeWidth={3}
                                    />
                                ))}
                            </div>
                        </div>
                        {request.review || request.feedback ? (
                            <p className="text-xs font-bold text-slate-500 italic max-w-[240px] text-center lg:text-right leading-relaxed bg-white/50 p-3 rounded-2xl border border-dashed border-slate-200 lg:bg-transparent lg:p-0 lg:border-0">
                                "{request.review || request.feedback}"
                            </p>
                        ) : (
                            <p className="text-xs font-bold text-slate-300 italic">No feedback added</p>
                        )}
                    </div>
                )}

                {request.status === 'cancelled' && (
                    <div className="bg-rose-50/30 p-4 rounded-2xl border border-dashed border-rose-200">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">Session Archived</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------- Helper Pill Component ---------------- */

const DetailPill = ({ icon: Icon, label }) => (
    <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl flex items-center gap-2 group-hover:border-indigo-100 transition-colors shadow-sm">
        <Icon className="text-indigo-400" size={13} />
        <span className="text-[12px] font-bold text-slate-600 tracking-tight">{label}</span>
    </div>
);

export default History;
