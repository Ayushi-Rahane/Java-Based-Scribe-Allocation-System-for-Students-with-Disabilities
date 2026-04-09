import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    GraduationCap, 
    MapPin, 
    ShieldCheck, 
    Camera, 
    Save, 
    X,
    CheckCircle2,
    Loader2,
    BookOpen,
    Bell,
    Clock,
    HeartPulse,
    Award
} from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";

const Profile = () => {
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({});
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const navigate = useNavigate();

    // Hydrate form with user profile on mount
    useEffect(() => {
        if (currentUser) {
            setProfile(currentUser);
            setFormData({
                fullName: currentUser.fullName || '',
                phone: currentUser.phone || '',
                dateOfBirth: currentUser.dateOfBirth || '',
                university: currentUser.university || '',
                course: currentUser.course || '',
                disabilityType: currentUser.disabilityType || '',
                certificateNumber: currentUser.certificateNumber || '',
                specificNeeds: currentUser.specificNeeds || '',
                currentYear: currentUser.currentYear || '',
                examFrequency: currentUser.examFrequency || '',
                preferredSubjects: currentUser.preferredSubjects || [],
                academicNotes: currentUser.academicNotes || '',
                preferredLanguage: currentUser.preferredLanguage || '',
                notificationMethod: currentUser.notificationMethod || '',
                preferredTime: currentUser.preferredTime || '',
                city: currentUser.city || '',
                state: currentUser.state || ''
            });
            setLoading(false);
        } else {
            navigate("/login");
        }
    }, [currentUser, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setUploadingPhoto(true); // Reusing loader state
            await studentService.updateProfile(formData);

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);

            // Refresh profile data
            const updatedProfile = await studentService.getProfile();
            setProfile(updatedProfile);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile: " + err.message);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpload = async () => {
        if (!photoFile) return;

        try {
            setUploadingPhoto(true);
            const result = await studentService.uploadProfilePhoto(photoFile);

            setProfile(prev => ({
                ...prev,
                profilePicture: result.profilePicture
            }));

            setPhotoFile(null);
            setPhotoPreview(null);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error("Error uploading photo:", err);
            alert("Failed to upload photo: " + err.message);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(" ");
        return parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <StudentSidebar />
                <div className="flex-1 md:ml-64 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-slate-400 font-bold tracking-tight">Syncing your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <StudentSidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="h-16 border-b bg-white flex items-center px-6 md:px-10 sticky top-0 z-20">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest pl-10 md:pl-0">Account Settings</span>
                </div>

                <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Profile Identity</h1>
                                <p className="text-slate-500 font-medium">Manage your personal information and academic accessibility preferences.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/student/dashboard')}
                                    className="px-6 py-3 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={uploadingPhoto}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {uploadingPhoto ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                    Save Profile Changes
                                </button>
                            </div>
                        </div>

                        {/* Profile Identity Card */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-10 animate-fadeIn">
                             <div className="h-32 bg-indigo-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 transform translate-x-10 -translate-y-10">
                                     <User size={160} className="text-white/10" />
                                </div>
                             </div>
                             
                             <div className="px-10 pb-10">
                                <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 mb-8 relative z-10">
                                    <div className="relative">
                                        {photoPreview || profile?.profilePicture ? (
                                            <img
                                                src={photoPreview || `${API_BASE_URL.replace('/api/v1', '')}${profile.profilePicture}`}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-[36px] object-cover border-[6px] border-white shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-[36px] bg-indigo-600 text-white flex items-center justify-center text-4xl font-black border-[6px] border-white shadow-xl">
                                                {getInitials(profile?.fullName)}
                                            </div>
                                        )}
                                        
                                        <label className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-slate-100 text-indigo-600 cursor-pointer hover:scale-110 transition-transform active:scale-95 group">
                                             <Camera size={20} />
                                             <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div className="mb-2">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{profile?.fullName}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Verified Student</span>
                                            <span className="text-[11px] font-bold text-slate-400 opacity-60">ID: {profile?._id?.substring(0,8).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    {photoFile && (
                                        <button
                                            onClick={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                            className="ml-auto bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                                        >
                                            {uploadingPhoto ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                                            Confirm Photo Update
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    {/* Personal Info */}
                                    <Section 
                                        icon={User} 
                                        title="Personal Identity" 
                                        subtitle="Core identity information"
                                    >
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputField label="Full Recognition Name" value={formData.fullName} onChange={(v) => handleInputChange('fullName', v)} icon={<User size={16} />} />
                                            <InputField label="Primary Contact Number" value={formData.phone} onChange={(v) => handleInputChange('phone', v)} icon={<Phone size={16} />} />
                                            <InputField label="Date of Birth" type="date" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""} onChange={(v) => handleInputChange('dateOfBirth', v)} icon={<Calendar size={16} />} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="City" value={formData.city} onChange={(v) => handleInputChange('city', v)} />
                                                <InputField label="State" value={formData.state} onChange={(v) => handleInputChange('state', v)} />
                                            </div>
                                        </div>
                                    </Section>

                                    {/* Academic Info */}
                                    <Section 
                                        icon={GraduationCap} 
                                        title="Academic Profile" 
                                        subtitle="University and course track"
                                    >
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputField label="University / Institution" value={formData.university} onChange={(v) => handleInputChange('university', v)} icon={<Award size={16} />} />
                                            <InputField label="Course / Major" value={formData.course} onChange={(v) => handleInputChange('course', v)} icon={<BookOpen size={16} />} />
                                            <InputField label="Active Semester / Year" value={formData.currentYear} onChange={(v) => handleInputChange('currentYear', v)} />
                                            <SelectField 
                                                label="Exam Load Frequency" 
                                                value={formData.examFrequency} 
                                                options={["Weekly", "Monthly", "Quarterly", "Semester-wise"]}
                                                onChange={(v) => handleInputChange('examFrequency', v)} 
                                            />
                                        </div>
                                    </Section>

                                    {/* Disability Info */}
                                    <Section 
                                        icon={HeartPulse} 
                                        title="Accessibility Needs" 
                                        subtitle="Support requirements settings"
                                    >
                                        <div className="grid grid-cols-1 gap-6">
                                            <SelectField 
                                                label="Nature of Disability" 
                                                value={formData.disabilityType} 
                                                options={[
                                                    "Visual Impairment",
                                                    "Hearing Impairment",
                                                    "Motor Disability",
                                                    "Learning Disability",
                                                    "Other"
                                                ]}
                                                onChange={(v) => handleInputChange('disabilityType', v)} 
                                            />
                                            <InputField label="Verification Certificate #" value={formData.certificateNumber} onChange={(v) => handleInputChange('certificateNumber', v)} icon={<ShieldCheck size={16} />} />
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Specific Accommodations</label>
                                                <textarea
                                                    value={formData.specificNeeds}
                                                    onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
                                                    rows={4}
                                                    placeholder="E.g. Extra time, screen reader compatibility, specialized scribe..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 resize-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </Section>

                                    {/* Preferences */}
                                    <Section 
                                        icon={Bell} 
                                        title="User Experience" 
                                        subtitle="Communication & notification settings"
                                    >
                                        <div className="grid grid-cols-1 gap-6">
                                            <SelectField 
                                                label="Primary Language" 
                                                value={formData.preferredLanguage} 
                                                options={["English", "Hindi", "Marathi", "Tamil", "Telugu"]}
                                                onChange={(v) => handleInputChange('preferredLanguage', v)} 
                                            />
                                            <SelectField 
                                                label="Broadcast Alert Method" 
                                                value={formData.notificationMethod} 
                                                options={["Email", "SMS", "WhatsApp", "Push Notify"]}
                                                onChange={(v) => handleInputChange('notificationMethod', v)} 
                                            />
                                            <SelectField 
                                                label="Ideal Session Time" 
                                                value={formData.preferredTime} 
                                                options={["Morning", "Afternoon", "Evening", "Anytime"]}
                                                onChange={(v) => handleInputChange('preferredTime', v)} 
                                            />
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Reference Notes</label>
                                                <textarea
                                                    value={formData.academicNotes}
                                                    onChange={(e) => handleInputChange('academicNotes', e.target.value)}
                                                    rows={3}
                                                    placeholder="Any other notes for the coordination team..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 resize-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </Section>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {showToast && (
                <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 animate-slideIn z-[200]">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                         <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="font-black uppercase tracking-widest text-[11px] opacity-80">Success</p>
                        <p className="font-bold tracking-tight">Profile synchronization complete.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ---------------- Helper Section Component ---------------- */

const Section = ({ icon: Icon, title, subtitle, children }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Icon size={22} strokeWidth={2.5} />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{title}</h4>
                <p className="text-xs font-medium text-slate-400">{subtitle}</p>
            </div>
        </div>
        <div className="bg-slate-50/30 rounded-[32px] p-6 border border-slate-50">
            {children}
        </div>
    </div>
);

export default Profile;
