import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Clock, 
    Calendar, 
    MapPin, 
    BookOpen, 
    User,
    ChevronRight,
    Zap
} from "lucide-react";
import requestService from "../../../services/requestService";

const ActiveRequest = () => {
    const [activeRequest, setActiveRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveRequest();
    }, []);

    const fetchActiveRequest = async () => {
        try {
            setLoading(true);
            const data = await requestService.getRequests();
            const active = data.find(r => r?.status?.toUpperCase() === 'PENDING' || r?.status?.toUpperCase() === 'MATCHED');
            setActiveRequest(active);
        } catch (err) {
            console.error("Error fetching active request:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2 min-h-[220px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium text-sm tracking-wide">Fetching active request...</p>
                </div>
            </div>
        );
    }

    if (!activeRequest) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                    <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Requests</h3>
                <p className="text-slate-500 text-sm max-w-xs mb-6">
                    You don't have any pending or matched scribe requests at the moment.
                </p>
                <button
                    onClick={() => navigate('/student/request')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 transition-all active:scale-95"
                >
                    Create New Request
                </button>
            </div>
        );
    }

    const examDate = new Date(activeRequest.examDate);
    const formattedDate = examDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = examDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 lg:col-span-2 group hover:shadow-md transition-all duration-300 relative overflow-hidden">
            
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={140} strokeWidth={1} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Zap size={20} className="animate-pulse" />
                        </div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Active Request</h3>
                    </div>

                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest border transition-colors ${
                        activeRequest.status?.toUpperCase() === 'MATCHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse-soft'
                    }`}>
                        {activeRequest.status?.toUpperCase() === 'MATCHED' ? '✓ Scribe Assigned' : '• Matching in progress'}
                    </span>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 mb-1 lg:text-3xl">{activeRequest.subject || activeRequest.examName}</h2>
                    <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-500" />
                            {formattedDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-indigo-500" />
                            {formattedTime}
                        </div>
                    </div>
                </div>

                {/* Progress bar for pending */}
                {activeRequest.status?.toUpperCase() === 'PENDING' && (
                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Matching Probability</p>
                            <p className="text-sm font-black text-indigo-600">70%</p>
                        </div>
                        <div className="h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 w-[70%] rounded-full animate-progress ring-4 ring-indigo-600/10"></div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Scanning our volunteer database for the best match. This usually takes 2-4 hours.
                        </p>
                    </div>
                )}

                {/* Status card for matched */}
                {activeRequest.status?.toUpperCase() === 'MATCHED' && activeRequest.volunteerId && (
                    <div className="mb-6 p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-0.5">Assigned Scribe</p>
                            <p className="text-lg font-bold">{activeRequest.volunteerId.fullName || 'Volunteer'}</p>
                        </div>
                    </div>
                )}

                {/* Attached Materials */}
                {activeRequest.materials && activeRequest.materials.length > 0 && (
                    <div className="mb-6">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Study Materials</p>
                        <div className="flex flex-wrap gap-2">
                            {activeRequest.materials.map((filename, idx) => (
                                <a 
                                    key={idx} 
                                    href={`http://localhost:8080/api/files/${filename}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-[12px] font-bold text-indigo-600 transition-colors truncate max-w-[200px]"
                                >
                                    📄 {filename}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: BookOpen, label: "Subject", val: activeRequest.subject },
                        { icon: Clock, label: "Duration", val: `${activeRequest.duration} Hours` },
                        { icon: MapPin, label: "Location", val: activeRequest.location },
                        { icon: User, label: "Language", val: activeRequest.language }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{item.label}</span>
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
                                <item.icon size={12} className="text-indigo-400 shrink-0" />
                                {item.val}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/student/active-requests')}
                    className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100 hover:scale-[1.02]"
                >
                    Detailed Overview <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ActiveRequest;
