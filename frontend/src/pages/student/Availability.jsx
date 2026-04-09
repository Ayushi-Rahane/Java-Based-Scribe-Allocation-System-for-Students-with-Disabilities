import React, { useState, useEffect } from "react";
import { 
    Star, 
    Mail, 
    Phone, 
    MessageCircle, 
    Filter, 
    Search, 
    MapPin, 
    Trophy, 
    Medal, 
    Award, 
    Clock, 
    Book, 
    Heart, 
    IndianRupee,
    ChevronDown,
    UserCheck
} from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import studentService from "../../services/studentService";
import API_BASE_URL from "../../config/api";

const Availability = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSubject, setFilterSubject] = useState("All");
    const [filterLanguage, setFilterLanguage] = useState("All");

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentService.getAvailableVolunteers();
            setVolunteers(data);
        } catch (err) {
            console.error("Error fetching volunteers:", err);
            setError(err.message || "Failed to load volunteers");
        } finally {
            setLoading(false);
        }
    };

    // Extract unique subjects and languages from volunteers
    const allSubjects = ["All", ...new Set(volunteers.flatMap(v => v.subjects || []))];
    const allLanguages = ["All", ...new Set(volunteers.flatMap(v => v.languages || []))];

    // Filter volunteers based on search and filters
    const filteredVolunteers = volunteers.filter(volunteer => {
        const matchesSearch = 
            volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            volunteer.subjects?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSubject = filterSubject === "All" || volunteer.subjects?.includes(filterSubject);
        const matchesLanguage = filterLanguage === "All" || volunteer.languages?.includes(filterLanguage);

        return matchesSearch && matchesSubject && matchesLanguage;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <StudentSidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="h-16 border-b bg-white flex items-center px-6 md:px-10 sticky top-0 z-20">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest pl-10 md:pl-0">Available Volunteers</span>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <UserCheck size={20} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Meet Your Volunteers</h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-13">Connect with verified volunteers ready to assist you in your next exam.</p>
                    </div>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto">
                        {/* Search and Filters */}
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 mb-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Search */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Search</label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by name or subject..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm font-medium text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Subject Filter */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Subject Area</label>
                                    <div className="relative group">
                                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                        <select
                                            value={filterSubject}
                                            onChange={(e) => setFilterSubject(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                                        >
                                            {allSubjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Language Filter */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Language</label>
                                    <div className="relative group">
                                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                        <select
                                            value={filterLanguage}
                                            onChange={(e) => setFilterLanguage(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                                        >
                                            {allLanguages.map(language => (
                                                <option key={language} value={language}>{language}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm animate-fadeIn">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-[5px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <p className="text-slate-500 font-bold tracking-tight">Curating volunteer list...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-3xl mb-8 flex items-center gap-4">
                                <Search size={24} />
                                <div>
                                    <p className="font-bold">Sync error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Volunteer Cards Grid */}
                        {!loading && !error && (
                            <>
                                <div className="mb-6 flex items-center gap-2 px-1">
                                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {filteredVolunteers.length} Active Profiles
                                    </span>
                                </div>

                                {filteredVolunteers.length > 0 ? (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {filteredVolunteers.map(volunteer => (
                                            <VolunteerCard key={volunteer._id} volunteer={volunteer} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                            <Search className="text-slate-200" size={40} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-400 mb-2 tracking-tight">No volunteers found</h3>
                                        <p className="text-slate-400 font-medium">Try adjusting your filters or search keywords.</p>
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

/* ---------------- Volunteer Card Component ---------------- */

const VolunteerCard = ({ volunteer }) => {
    const [showContact, setShowContact] = useState(false);

    const fullName = volunteer.fullName || 'Unknown';
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    const rating = volunteer.rating || 0;
    const totalReviews = volunteer.totalRatings || 0;
    const subjects = volunteer.subjects || [];
    const languages = volunteer.languages || [];
    const email = volunteer.userId?.email || null;
    const completedAssignments = volunteer.completedAssignments || 0;
    const volunteerType = volunteer.volunteerType || 'free';
    const hourlyRate = volunteer.hourlyRate || 0;
    const location = volunteer.city && volunteer.state ? `${volunteer.city}, ${volunteer.state}` : 'Location hidden';
    
    // Achievement Logic
    const getBadge = (count) => {
        if (count >= 50) return { name: "Elite", icon: Trophy, color: "bg-indigo-600 text-white" };
        if (count >= 20) return { name: "Pro", icon: Medal, color: "bg-emerald-600 text-white" };
        if (count >= 5) return { name: "Rising", icon: Award, color: "bg-amber-600 text-white" };
        return null;
    };
    const badge = getBadge(completedAssignments);

    // Availability parsing
    let availability = 'Not specified';
    if (volunteer.availability && typeof volunteer.availability === 'object') {
        const slots = [];
        Object.entries(volunteer.availability).forEach(([day, times]) => {
            if (times && typeof times === 'object') {
                const activeTimes = Object.entries(times)
                    .filter(([_, isAvail]) => isAvail)
                    .map(([t]) => t.charAt(0).toUpperCase() + t.slice(1));
                if (activeTimes.length > 0) {
                    slots.push(`${day.charAt(0).toUpperCase() + day.slice(1)} (${activeTimes.join(', ')})`);
                }
            }
        });
        availability = slots.length > 0 ? slots.join(' · ') : 'On-demand only';
    }

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all group animate-fadeIn flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-start gap-6 mb-8">
                {volunteer.profilePicture ? (
                    <img
                        src={`${API_BASE_URL.split('/api')[0]}${volunteer.profilePicture}`}
                        alt={fullName}
                        className="w-20 h-20 rounded-[28px] object-cover border-4 border-slate-50 flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-[28px] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20">
                        {initials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{fullName}</h3>
                        {badge && (
                            <span className={`${badge.color} text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm`}>
                                <badge.icon size={10} strokeWidth={3} />
                                {badge.name}
                            </span>
                        )}
                    </div>

                    {/* Badge / Type */}
                    <div className="flex items-center gap-3 mb-4">
                        {volunteerType === 'paid' ? (
                            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 border border-emerald-100">
                                <IndianRupee size={12} strokeWidth={3} /> Professional · ₹{hourlyRate}/hr
                            </span>
                        ) : (
                            <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 border border-indigo-100">
                                <Heart size={12} strokeWidth={3} /> Verified Volunteer
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-100"}
                                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                                    size={14}
                                />
                            ))}
                        </div>
                        <span className="text-[13px] font-black text-slate-900">{rating.toFixed(1)}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-60">({totalReviews} Reviews)</span>
                    </div>
                </div>
            </div>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 flex-1">
                {/* Subjects */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expertise Areas</p>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                            <span key={subject} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-100">
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Linguistic Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {languages.map(language => (
                            <span key={language} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-xl text-[11px] font-bold border border-indigo-100/50">
                                {language}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50 mb-8">
                <MetadataItem icon={MapPin} label="Location" value={location} />
                <MetadataItem icon={Clock} label="Experience" value={volunteer.experience || 'Not listed'} />
            </div>

            <div className="bg-slate-50 rounded-3xl p-5 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock size={12} /> Typical Availability
                </p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed truncate">{availability}</p>
            </div>

            {/* Contact Action */}
            <div className="mt-auto">
                <button
                    onClick={() => setShowContact(!showContact)}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] 
                        ${showContact 
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl"}`}
                >
                    {showContact ? "Close Contact Vault" : "Reveal Professional Contacts"}
                </button>

                {showContact && (
                    <div className="mt-4 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/30 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                        {email && (
                            <ContactItem
                                icon={Mail}
                                label="Work Email"
                                value={email}
                                href={`mailto:${email}`}
                            />
                        )}
                        {volunteer.phone && (
                            <ContactItem
                                icon={Phone}
                                label="Phone / WhatsApp"
                                value={volunteer.phone}
                                href={`https://wa.me/${volunteer.phone.replace(/[^0-9]/g, '')}`}
                                isSpecial
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------- Helper Components ---------------- */

const MetadataItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <Icon size={14} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-[13px] font-bold text-slate-700 truncate leading-none">{value}</p>
        </div>
    </div>
);

const ContactItem = ({ icon: Icon, label, value, href, isSpecial }) => (
    <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-slate-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSpecial ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <a href={href} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block underline decoration-indigo-200 underline-offset-4">
                {value}
            </a>
        </div>
    </div>
);

export default Availability;
