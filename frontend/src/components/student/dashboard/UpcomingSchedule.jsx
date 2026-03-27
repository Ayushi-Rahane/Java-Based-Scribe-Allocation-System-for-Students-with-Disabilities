import React, { useState, useEffect } from "react";
import { 
    Clock, 
    UserCheck, 
    Calendar,
    ArrowRight,
    MapPin
} from "lucide-react";
import requestService from "../../../services/requestService";

const UpcomingSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const data = await requestService.getRequests();

            const upcomingExams = data
                .filter(r => r.status === 'matched')
                .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
                .slice(0, 3);

            const scheduleData = upcomingExams.map(req => {
                const examDate = new Date(req.examDate);
                const month = examDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = examDate.getDate().toString().padStart(2, '0');
                const startTime = examDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                });

                const endDate = new Date(examDate.getTime() + (req.duration * 60 * 60 * 1000));
                const endTime = endDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                });

                return {
                    id: req._id,
                    month,
                    day,
                    title: req.examName,
                    time: `${startTime} - ${endTime}`,
                    volunteer: req.volunteerId?.fullName || 'Volunteer assigned',
                    location: req.location
                };
            });

            setSchedule(scheduleData);
        } catch (err) {
            console.error("Error fetching schedule:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Upcoming Schedule
                </h3>
                <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-700 transition-colors flex items-center gap-1">
                    Agenda <ArrowRight size={14} />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center py-12">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-xs font-medium">Syncing calendar...</p>
                    </div>
                </div>
            ) : schedule.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 mb-2">
                    <Calendar size={32} className="text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No confirmed exams</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedule.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border border-slate-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 group">
                            {/* Date box */}
                            <div className="w-14 h-15 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors transition-all">
                                <span className="text-[10px] font-black group-hover:text-white/80 text-indigo-600 uppercase tracking-wider">{item.month}</span>
                                <span className="text-xl font-black group-hover:text-white text-slate-900 leading-none mt-0.5">{item.day}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-[14px] truncate leading-tight mb-1 tracking-tight">{item.title}</p>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                                        <Clock size={12} className="text-indigo-400" />
                                        {item.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium truncate">
                                        <MapPin size={12} className="text-indigo-400" strokeWidth={2.5} />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
                                        <UserCheck size={11} />
                                        {item.volunteer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingSchedule;
