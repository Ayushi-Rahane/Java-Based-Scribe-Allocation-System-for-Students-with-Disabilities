import React, { useState, useEffect } from "react";
import { 
    CheckCircle2, 
    UserCheck, 
    PlusCircle, 
    Clock,
    ArrowRight
} from "lucide-react";
import requestService from "../../../services/requestService";

const iconMap = {
    completed: {
        icon: <CheckCircle2 size={18} />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    matched: {
        icon: <UserCheck size={18} />,
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    pending: {
        icon: <PlusCircle size={18} />,
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-100"
    },
    created: {
        icon: <PlusCircle size={18} />,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        border: "border-indigo-100"
    },
};

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const [activeData, historyData] = await Promise.all([
                requestService.getRequests(),
                requestService.getHistory()
            ]);

            const allRequests = [...activeData, ...historyData]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            const activityList = allRequests.map(req => {
                const createdDate = new Date(req.createdAt);
                const timeAgo = getTimeAgo(createdDate);

                let title, desc, type;

                if (req.status === 'completed') {
                    title = "Request Completed";
                    desc = `${req.subject} · Rated ${req.rating || 'N/A'} stars`;
                    type = "completed";
                } else if (req.status === 'matched') {
                    title = "Scribe Assigned";
                    desc = `${req.subject} · ${req.volunteerId?.fullName || 'Volunteer assigned'}`;
                    type = "matched";
                } else if (req.status === 'pending') {
                    title = "Request Created";
                    desc = `${req.subject} · Waiting for match`;
                    type = "pending";
                } else {
                    title = "Request Created";
                    desc = req.subject;
                    type = "created";
                }

                return {
                    id: req._id,
                    type,
                    title,
                    desc,
                    time: timeAgo
                };
            });

            setActivities(activityList);
        } catch (err) {
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Recent Activity
                </h3>
                <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-700 transition-colors flex items-center gap-1">
                    See logs <ArrowRight size={14} />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-xs font-medium">Updating feed...</p>
                    </div>
                </div>
            ) : activities.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-12">
                    <p className="text-slate-400 text-sm font-medium">No activity to show</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {activities.map((item, idx) => (
                        <ActivityRow key={item.id} {...item} isLast={idx === activities.length - 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ActivityRow = ({ type, title, desc, time, isLast }) => {
    const styling = iconMap[type] || iconMap.created;

    return (
        <div className={`flex items-start gap-4 py-4 ${!isLast ? 'border-b border-dashed border-slate-100' : ''} group hover:bg-slate-50 transition-colors px-2 rounded-2xl`}>
            {/* Icon container */}
            <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center border ${styling.border} ${styling.bg} shadow-sm group-hover:scale-105 transition-transform`}>
                <span className={`${styling.color}`}>{styling.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[14px] font-bold text-slate-900 truncate tracking-tight">{title}</p>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock size={10} />
                        {time}
                    </span>
                </div>
                <p className="text-[13px] text-slate-500 font-medium truncate">{desc}</p>
            </div>
        </div>
    );
};

export default RecentActivity;
