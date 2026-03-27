import React, { useState } from "react";
import { 
    BookOpen, 
    X, 
    UploadCloud, 
    Loader2, 
    Trash2,
    CheckCircle2,
    AlertCircle,
    FileText
} from "lucide-react";
import studentService from "../../../services/studentService";

const TipsCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleOpenModal = async () => {
        setShowModal(true);
        setLoadingRequests(true);
        setMessage({ type: "", text: "" });
        try {
            const data = await studentService.getRequests();
            // Filter for pending, accepted, or in-progress requests and deduplicate
            const activeRequests = data.filter(r =>
                ['pending', 'accepted', 'in-progress'].includes(r.status)
            );

            // Remove duplicates based on _id
            const uniqueRequests = Array.from(new Map(activeRequests.map(item => [item._id, item])).values());
            setRequests(uniqueRequests);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setMessage({ type: "error", text: "Failed to load requests" });
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleDeleteMaterial = async (requestId, filename) => {
        if (!window.confirm('Delete this reference material?')) return;
        
        try {
            setUploading(true);
            await studentService.deleteRequestMaterial(requestId, filename);
            
            // Refresh requests list
            const updatedData = await studentService.getRequests();
            const activeRequests = updatedData.filter(r =>
                ['pending', 'accepted', 'in-progress'].includes(r.status)
            );
            const uniqueRequests = Array.from(new Map(activeRequests.map(item => [item._id, item])).values());
            setRequests(uniqueRequests);
            
            setMessage({ type: "success", text: "Material deleted successfully" });
        } catch (err) {
            console.error("Error deleting material:", err);
            setMessage({ type: "error", text: "Delete failed" });
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedRequest || !file) {
            setMessage({ type: "error", text: "Please select a request and a file" });
            return;
        }
        setUploading(true);
        setMessage({ type: "", text: "" });
        try {
            await studentService.uploadRequestMaterials(selectedRequest, file);
            setMessage({ type: "success", text: "Material uploaded successfully!" });
            setFile(null);
            
            // Refresh to show new material
            const updatedData = await studentService.getRequests();
            const activeRequests = updatedData.filter(r =>
                ['pending', 'accepted', 'in-progress'].includes(r.status)
            );
            const uniqueRequests = Array.from(new Map(activeRequests.map(item => [item._id, item])).values());
            setRequests(uniqueRequests);

            setTimeout(() => {
                setShowModal(false);
                setMessage({ type: "", text: "" });
            }, 2000);
        } catch (err) {
            console.error("Error uploading material:", err);
            setMessage({ type: "error", text: "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between h-full relative overflow-hidden group">
                {/* Decorative blob */}
                <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">System Tip</h3>
                    </div>

                    <p className="text-[15px] font-medium leading-relaxed mb-8 opacity-90">
                        Help your scribe prepare! Upload your reference material ahead of time so they can review the syllabus and key terms.
                    </p>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="relative z-10 bg-white text-indigo-600 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-all hover:shadow-lg active:scale-[0.98] text-sm tracking-wide"
                >
                    Upload Materials
                </button>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl animate-fadeIn">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <UploadCloud size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Material</h3>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 font-semibold ${
                                message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                                {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                                {message.text}
                            </div>
                        )}

                        {loadingRequests ? (
                            <div className="text-center py-12 text-slate-500">
                                <Loader2 className="animate-spin mx-auto mb-3 text-indigo-600" size={32} />
                                <p className="text-sm font-bold tracking-wide">Syncing your requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <FileText className="mx-auto mb-3 text-slate-300" size={40} />
                                <p className="text-sm font-bold text-slate-900 mb-1">No active requests found</p>
                                <p className="text-xs font-medium text-slate-400">Create a request first to upload materials.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">
                                        Select Active Request
                                    </label>
                                    <select
                                        value={selectedRequest}
                                        onChange={(e) => setSelectedRequest(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 focus:outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700 text-sm shadow-sm"
                                    >
                                        <option value="">-- Choose target request --</option>
                                        {requests.map(req => (
                                            <option key={req._id} value={req._id}>
                                                {req.subject} · {new Date(req.examDate).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Existing Materials List */}
                                {selectedRequest && (() => {
                                    const req = requests.find(r => r._id === selectedRequest);
                                    if (req && req.materials && req.materials.length > 0) {
                                        return (
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 font-sans">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText size={14} className="text-slate-400" />
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Management</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    {req.materials.map((mat, idx) => {
                                                        const filename = mat.split('/').pop();
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-fadeIn">
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                                                        <FileCheck size={12} className="text-indigo-600" />
                                                                    </div>
                                                                    <span className="truncate text-slate-700 font-bold">{filename}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteMaterial(selectedRequest, filename)}
                                                                    className="text-slate-300 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-all"
                                                                    title="Delete file"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">
                                        Reference File
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label 
                                            htmlFor="file-upload"
                                            className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/50 hover:border-indigo-400 transition-all group"
                                        >
                                            <UploadCloud size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                            <span className="text-xs font-bold text-slate-600">
                                                {file ? file.name : "Click to select a file"}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                                                PDF, DOCX, JPG (Max 10MB)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || !selectedRequest || !file}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin text-indigo-400" size={18} />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        'Confirm Upload'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TipsCard;
