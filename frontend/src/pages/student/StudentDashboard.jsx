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
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight md:hidden ml-8">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Action Buttons */}
                        <button
                            onClick={handleNewRequest}
                            className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 transition-all active:scale-95"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span className="hidden sm:inline tracking-wide">NEW REQUEST</span>
                        </button>

                        <div className="flex items-center gap-2">
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
                        </div>

                        {/* Timeline Column */}
                        <div className="lg:col-span-1">
                            <RecentActivity />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
