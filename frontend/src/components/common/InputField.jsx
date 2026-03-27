import React from "react";

const InputField = ({ label, placeholder, icon, value, onChange, type = "text", disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <input
                type={type}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 ${icon ? 'pr-12' : ''} ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
            />
            {icon && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                    {icon}
                </span>
            )}
        </div>
    </div>
);

export default InputField;
