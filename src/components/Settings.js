
"use client";

import React from 'react';
import { Settings as SettingsIcon, Bell, Watch, Moon, Sun, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = ({ settings, onUpdate }) => {
    const options = [
        { id: 'focusTime', label: 'Focus Combat (min)', icon: <Watch size={18} />, type: 'number', min: 1, max: 60 },
        { id: 'shortBreak', label: 'Recovery (min)', icon: <Watch size={18} />, type: 'number', min: 1, max: 20 },
        { id: 'longBreak', label: 'Deep Meditation (min)', icon: <Watch size={18} />, type: 'number', min: 1, max: 45 },
        { id: 'notifications', label: 'Tactical Alerts', icon: <Bell size={18} />, type: 'toggle' },
        { id: 'apiKey', label: 'Neural Intelligence Key', icon: <Moon size={18} />, type: 'password' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <SettingsIcon size={20} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">System Configuration</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 italic">V1.42-STABLE</span>
            </div>

            <div className="p-6 space-y-6">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-slate-100">
                                {option.icon}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{option.label}</p>
                                <p className="text-[10px] font-medium text-slate-400 italic">Adjust your theater of operations.</p>
                            </div>
                        </div>

                        {option.type === 'number' ? (
                            <input
                                type="number"
                                value={settings[option.id]}
                                onChange={(e) => onUpdate({ [option.id]: parseInt(e.target.value) })}
                                className="w-20 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-center text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all shadow-inner"
                            />
                        ) : option.type === 'password' ? (
                            <input
                                type="password"
                                value={settings[option.id]}
                                onChange={(e) => onUpdate({ [option.id]: e.target.value })}
                                placeholder="Paste GEMINI_API_KEY"
                                className="w-48 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all italic"
                            />
                        ) : (
                            <button
                                onClick={() => onUpdate({ [option.id]: !settings[option.id] })}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${settings[option.id] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <motion.div
                                    animate={{ x: settings[option.id] ? 24 : 0 }}
                                    className="h-6 w-6 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        )}
                    </div>
                ))}

                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <p className="text-[10px] font-black items-center text-slate-400 uppercase tracking-[0.2em] mb-4">Tactical Theme</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onUpdate({ theme: 'zen' })}
                            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${settings.theme === 'zen' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                            <Sun size={18} />
                            <span className="text-[10px] items-center font-black uppercase tracking-widest">Zen Soft</span>
                        </button>
                        <button
                            onClick={() => onUpdate({ theme: 'pro' })}
                            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${settings.theme === 'pro' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                            <Moon size={18} />
                            <span className="text-[10px] items-center font-black uppercase tracking-widest">High Pro</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
