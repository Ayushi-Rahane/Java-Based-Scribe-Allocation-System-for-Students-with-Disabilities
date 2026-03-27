import React, { useState, useEffect } from "react";
import { 
    BarChart3, 
    ClipboardCheck, 
    CalendarCheck, 
    History,
    TrendingUp,
    MoreHorizontal
} from "lucide-react";
import requestService from "../../../services/requestService";

const StatsCards = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        upcomingExams: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const activeData = await requestService.getRequests();
            const activeRequests = activeData.filter(r => ['pending', 'matched'].includes(r.status));
            const upcomingExams = activeData.filter(r => r.status === 'matched').length;

            const historyData = await requestService.getHistory();
            const completedRequests = historyData.filter(r => r.status === 'completed').length;

            setStats({
                totalRequests: activeRequests.length + completedRequests,
                activeRequests: activeRequests.length,
                completedRequests,
                upcomingExams
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        {
            id: 1,
            title: "Total Requests",
            value: loading ? "..." : stats.totalRequests,
            subtitle: `${stats.completedRequests} completed`,
            icon: BarChart3,
            color: "#4F46E5",
            bg: "#EEF2FF",
        },
        {
            id: 2,
            title: "Active Requests",
            value: loading ? "..." : stats.activeRequests,
            subtitle: stats.activeRequests > 0 ? "Under review" : "No active requests",
            icon: ClipboardCheck,
            color: "#0891B2",
            bg: "#ECFEFF",
        },
        {
            id: 3,
            title: "Upcoming Exams",
            value: loading ? "..." : stats.upcomingExams,
            subtitle: stats.upcomingExams > 0 ? "Scribe confirmed" : "None scheduled",
            icon: CalendarCheck,
            color: "#059669",
            bg: "#F0FDF4",
        },
        {
            id: 4,
            title: "Completed",
            value: loading ? "..." : stats.completedRequests,
            subtitle: "Overall success",
            icon: History,
            color: "#7C3AED",
            bg: "#F5F3FF",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsData.map((stat) => (
                <div key={stat.id} className="bg-white border-white rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all duration-300 border">
                    <div className="flex items-center justify-between mb-4">
                        <div 
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: stat.bg }}
                        >
                            <stat.icon size={22} style={{ color: stat.color }} strokeWidth={2.5} />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h2>
                        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-bold">
                            <TrendingUp size={12} />
                            <span>Update</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">{stat.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
