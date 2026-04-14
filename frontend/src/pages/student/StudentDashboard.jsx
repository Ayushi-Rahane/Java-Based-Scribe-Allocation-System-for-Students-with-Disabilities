import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import requestService from "../../services/requestService";
import { 
    Bell, 
    Plus, 
    Search,
    User,
    ChevronDown,
    LayoutDashboard
} from "lucide-react";

import StudentSidebar from "../../components/student/StudentSidebar";
import RecentActivity from "../../components/student/dashboard/RecentActivity";
import TipsCard from "../../components/student/dashboard/TipsCard";
import UpcomingSchedule from "../../components/student/dashboard/UpcomingSchedule";
import StatsCards from "../../components/student/dashboard/StatsCards";
import ActiveRequest from "../../components/student/dashboard/ActiveRequest";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeCount, setActiveCount] = useState(0);

    useEffect(() => {
        requestService.getRequests().then(data => {
            setActiveCount(data.length);
        }).catch(() => setActiveCount(0));
    }, []);

    const handleNewRequest = () => {
        navigate('/student/request');
    };

    const firstName = user?.fullName?.split(' ')[0] || 'Student';

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins',_sans-serif]">

            {/* Sidebar */}
            <StudentSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64">

                {/* Navbar / Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center md:hidden">
                            <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight hidden md:block">Dashboard Overview</h2>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight md:hidden ml-8">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex items-center relative group">
                            <Search className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search exams, documents..." 
                                className="bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm w-64 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 focus:outline-none transition-all font-medium text-slate-600"
                            />
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={handleNewRequest}
                            className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 transition-all active:scale-95"
                        >
                            <Plus size={18} strokeWidth={3} /> 
                            <span className="hidden sm:inline tracking-wide">NEW REQUEST</span>
                        </button>

                        <div className="flex items-center gap-2">
                             <button className="relative w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-indigo-600/20 transition-colors ml-1">
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 md:p-10 max-w-[1400px] mx-auto w-full space-y-8 animate-fadeIn">

                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                                Current Overview
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Welcome back, {firstName}! 
                            </h1>
                            <p className="text-sm md:text-base text-slate-500 font-medium mt-2">
                                {activeCount > 0 ? (
                                    <>You have <span className="text-indigo-600 font-bold">{activeCount} active {activeCount === 1 ? 'match' : 'matches'}</span> in progress today.</>
                                ) : (
                                    <>No active matches right now. <span className="text-indigo-600 font-bold cursor-pointer" onClick={handleNewRequest}>Create one!</span></>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-bold text-slate-700">Live Status</span>
                            <ChevronDown size={16} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Stats Summary Section */}
                    <StatsCards />

                    {/* Primary Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Highlights & Tips Column */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                             {/* Active Request - Major Highlight */}
                            <ActiveRequest />
                            
                            {/* Tips Card - Subtle Highlight */}
                            <div className="md:h-full lg:h-auto">
                                <TipsCard />
                            </div>
                        </div>

                        {/* Timeline Column */}
                        <div className="lg:col-span-1">
                            <RecentActivity />
                        </div>
                    </div>

                    {/* Secondary Row - Schedule & More */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
                        {/* Upcoming Schedule */}
                        <div className="lg:col-span-1">
                            <UpcomingSchedule />
                        </div>

                        {/* Placeholder for more student info / Quick Links */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/50 to-white rounded-[32px] border border-slate-100 p-8 flex flex-col items-center justify-center text-center group border-dashed">
                            <div className="w-20 h-20 bg-white shadow-xl rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <LayoutDashboard size={40} className="text-indigo-200" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">More Tools Coming Soon</h3>
                            <p className="text-slate-500 text-sm max-w-md font-medium">
                                We're building new features to help you manage your accessibility needs, including direct messaging with scribes and study material repositories.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <div className="px-5 py-2.5 bg-indigo-600/5 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">Messaging</div>
                                <div className="px-5 py-2.5 bg-indigo-600/5 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">Resource Hub</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
