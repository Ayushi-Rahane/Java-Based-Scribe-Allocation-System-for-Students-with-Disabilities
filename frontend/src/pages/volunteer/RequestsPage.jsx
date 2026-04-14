import React, { useState, useEffect } from "react";
import { Search, InboxIcon, Calendar, Clock, FileText, CheckCircle2, XCircle, ChevronDown, BookOpen, HeartPulse, Languages, MapPin, Loader2 } from "lucide-react";
import volunteerService from "../../services/volunteerService";
import { Avatar, MatchScore, DisabilityBadge, EmptyState, Toast } from "../../components/UI";

function RequestCard({ req, onAccept, onDecline }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null);

  const timeAgo = (iso) => {
    if (!iso) return "recently";
    const m = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 transition-all hover:shadow-md">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <Avatar name={req.studentName} size="md" />
          <div>
            <div className="font-bold text-slate-900 text-lg">{req.studentName}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Posted {timeAgo(req.postedAt)}</span>
              <span>•</span>
              <MapPin size={10} className="text-slate-400" />
              <span>{req.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MatchScore score={req.matchScore} />
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
          >
            <ChevronDown size={20} className={`transform transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Subject heading */}
      <div className="text-xl font-bold text-slate-900 mb-3">{req.subject}</div>

      {/* Badges/Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
          <HeartPulse size={13} /> {req.disability}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
          <Languages size={13} /> {req.language}
        </span>
      </div>

      {/* Exam Detail Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: Calendar, label: "Exam Date", value: req.examDate },
          { icon: Clock,    label: "Time",      value: req.examTime },
          { icon: Clock,    label: "Duration",  value: req.duration },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">{value}</div>
          </div>
        ))}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-100 pt-5 mt-2 animate-fadeIn mb-5">
          {req.notes && (
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Student Notes</div>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed m-0 border border-slate-100">
                {req.notes}
              </p>
            </div>
          )}
          {req.materials && req.materials.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Study Materials</div>
              <div className="flex gap-2 flex-wrap">
                {req.materials.map(m => (
                  <div key={m} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                    <FileText size={14} /> {m}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          disabled={loading !== null}
          onClick={async () => { setLoading("accept"); await onAccept(req.id); setLoading(null); }}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading === "accept" ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16}/> Accept Request</>}
        </button>
        <button 
          disabled={loading !== null}
          onClick={async () => { setLoading("decline"); await onDecline(req.id); setLoading(null); }}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading === "decline" ? <Loader2 size={16} className="animate-spin" /> : <><XCircle size={16}/> Pass</>}
        </button>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await volunteerService.getMatchedRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showToast = (msg, type = "success") => { 
    setToast({ msg, type }); 
    setTimeout(() => setToast(null), 3000); 
  };

  const handleAccept = async (id) => {
    const res = await volunteerService.acceptRequest(id);
    if (res.success) {
      showToast("Request accepted! Check Active Assignments.");
      setRequests(prev => prev.filter(r => r.id !== id));
    } else {
      showToast(res.error || "Failed to accept request", "error");
    }
  };

  const handleDecline = async (id) => {
    await volunteerService.declineRequest(id);
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("Request removed from queue.", "info");
  };

  const filtered = requests
    .filter(r => {
      const q = search.toLowerCase();
      return !q || r.studentName.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.disability.toLowerCase().includes(q);
    })
    .sort((a,b) => b.matchScore - a.matchScore);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Incoming Requests</h1>
          <p className="text-slate-500 font-medium">You have {requests.length} open opportunities matching your profile.</p>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium text-slate-700" 
            placeholder="Search by student, subject, or disability..."
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        {/* Lists */}
        {filtered.length === 0 ? (
          <EmptyState icon={InboxIcon} title="No requests found" subtitle="No incoming requests match your search criteria right now." />
        ) : (
          <div className="space-y-6">
            {filtered.map((req, i) => (
              <div key={req.id} className="animate-slideIn" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
                <RequestCard 
                  req={req}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              </div>
            ))}
          </div>
        )}

      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
}
