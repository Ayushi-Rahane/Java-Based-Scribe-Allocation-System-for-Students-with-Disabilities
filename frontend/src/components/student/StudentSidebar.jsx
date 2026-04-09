import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    FileText,
    CheckCircle,
    History,
    Calendar,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

const menuItems = [
    { label: "Dashboard", icon: <Home size={18} />, path: "/student/dashboard" },
    { label: "Request Scribe", icon: <FileText size={18} />, path: "/student/request" },
    { label: "Active Requests", icon: <CheckCircle size={18} />, path: "/student/active" },
    { label: "History", icon: <History size={18} />, path: "/student/history" },
    { label: "Availability", icon: <Calendar size={18} />, path: "/student/availability" },
    { label: "Profile", icon: <User size={18} />, path: "/student/profile" },
];

const StudentSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const currentPath = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [studentName, setStudentName] = useState("Loading...");
    const [studentInitials, setStudentInitials] = useState("??");
    const [profilePicture, setProfilePicture] = useState(null);

    // Color constants
    const C = {
        primary: "#4F46E5",
        primaryHover: "#4338CA",
        bg: "#0F172A", // Dark slate for sidebar
        text: "#94A3B8",
        textActive: "#FFFFFF",
    };

    useEffect(() => {
        if (user && user.fullName) {
            setStudentName(user.fullName);
            const parts = user.fullName.split(" ");
            const initials = parts.length >= 2
                ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                : user.fullName.substring(0, 2).toUpperCase();
            setStudentInitials(initials);
            setProfilePicture(user.profilePicture);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-3 left-4 z-50 bg-[#4F46E5] text-white p-2.5 rounded-xl shadow-lg"
            >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-slate-400 z-40 
                transition-transform duration-300 ease-in-out border-r border-slate-800
                flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>

                {/* Logo */}
                <div className="p-6 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <FileText size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Scribe<span className="text-indigo-500">Connect</span>
                        </span>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">MAIN MENU</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${currentPath === item.path 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold" 
                                    : "hover:bg-slate-800/50 hover:text-slate-200"}
                            `}
                        >
                            <span className={`${currentPath === item.path ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`}>
                                {item.icon}
                            </span>
                            <span className="text-[14px]">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer / User */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-3 p-2 mb-3">
                        {profilePicture ? (
                            <img
                                src={`${API_BASE_URL.split('/api')[0]}${profilePicture}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
                                {studentInitials}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{studentName}</p>
                            <p className="text-[11px] text-slate-500 font-medium">Student</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default StudentSidebar;
