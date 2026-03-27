import React from "react";
import { ChevronDown } from "lucide-react";

const SelectField = ({ label, options, defaultOption = "Select type", value, onChange, disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <select 
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                disabled={disabled}
                className={`w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
            >
                <option value="" disabled>{defaultOption}</option>
                {options && options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={16} />
        </div>
    </div>
);

export default SelectField;
