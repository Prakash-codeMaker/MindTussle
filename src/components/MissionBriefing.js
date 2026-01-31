"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Clock, ArrowRight, Brain, Zap, Radio, Loader2, Globe, Plus, X } from 'lucide-react';

const MissionBriefing = ({ onStart }) => {
    const [step, setStep] = useState(1);
    const [objective, setObjective] = useState('');
    const [trackingType, setTrackingType] = useState('STRICT');
    const [allowedSites, setAllowedSites] = useState([]);
    const [newSite, setNewSite] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const popularSites = [
        { name: 'ChatGPT', domain: 'chat.openai.com' },
        { name: 'LeetCode', domain: 'leetcode.com' },
        { name: 'GitHub', domain: 'github.com' },
        { name: 'Stack Overflow', domain: 'stackoverflow.com' },
        { name: 'Google Docs', domain: 'docs.google.com' },
        { name: 'Notion', domain: 'notion.so' },
        { name: 'VS Code Web', domain: 'vscode.dev' },
        { name: 'Figma', domain: 'figma.com' },
    ];

    const addSite = (domain) => {
        if (domain && !allowedSites.includes(domain)) {
            setAllowedSites([...allowedSites, domain]);
        }
        setNewSite('');
    };

    const removeSite = (domain) => {
        setAllowedSites(allowedSites.filter(s => s !== domain));
    };

    const handleStart = () => {
        if (objective) {
            setIsLoading(true);
            onStart(objective, trackingType, allowedSites);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative my-8"
            >
                {/* Progress Bar */}
                <div className="h-1.5 bg-slate-100 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        initial={{ width: '25%' }}
                        animate={{ width: step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%' }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                <div className="p-8 space-y-6">
                    {/* Step 1: Mission Objective */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Brain size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">What's Your Mission?</h2>
                                    <p className="text-sm text-slate-400">Describe what you want to accomplish</p>
                                </div>
                            </div>

                            <textarea
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                placeholder="e.g. Complete the Next.js tutorial, solve 5 LeetCode problems..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-28 resize-none"
                            />

                            <button
                                onClick={() => objective && setStep(2)}
                                disabled={!objective}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Allowed Websites */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Globe size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Allowed Websites</h2>
                                    <p className="text-sm text-slate-400">Only these sites will be accessible</p>
                                </div>
                            </div>

                            {/* Quick Add Popular Sites */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase">Quick Add</p>
                                <div className="flex flex-wrap gap-2">
                                    {popularSites.map(site => (
                                        <button
                                            key={site.domain}
                                            onClick={() => addSite(site.domain)}
                                            disabled={allowedSites.includes(site.domain)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                                ${allowedSites.includes(site.domain)
                                                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            {allowedSites.includes(site.domain) ? '✓ ' : '+ '}{site.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Site Input */}
                            <div className="flex gap-2">
                                <input
                                    value={newSite}
                                    onChange={(e) => setNewSite(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addSite(newSite)}
                                    placeholder="Add custom site (e.g. example.com)"
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => addSite(newSite)}
                                    className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Selected Sites */}
                            {allowedSites.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Your Whitelist ({allowedSites.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allowedSites.map(site => (
                                            <span key={site} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                                                {site}
                                                <button onClick={() => removeSite(site)} className="hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-xs text-amber-700">
                                    ⚠️ All other websites will be blocked during your mission. Make sure to add everything you need!
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-semibold text-sm">
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-[2] bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Protection Level */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Protection Level</h2>
                                <p className="text-sm text-slate-400 mt-1">How strict should we be?</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'STRICT', label: 'Strict Block', desc: 'Completely blocks non-whitelisted sites', icon: <Shield size={20} /> },
                                    { id: 'BALANCED', label: 'Gentle Reminder', desc: 'Shows warning but allows continue', icon: <Zap size={20} /> },
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setTrackingType(option.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                                            ${trackingType === option.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${trackingType === option.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {option.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${trackingType === option.id ? 'text-emerald-700' : 'text-slate-700'}`}>{option.label}</p>
                                            <p className="text-xs text-slate-400">{option.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-semibold text-sm">
                                    Back
                                </button>
                                <button onClick={() => setStep(4)} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold text-sm">
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirm & Start */}
                    {step === 4 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
                                    <Radio size={40} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Ready to Focus!</h2>
                                <p className="text-sm text-slate-400 mt-1">Your mission is configured</p>
                            </div>

                            <div className="p-5 bg-slate-50 rounded-xl space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Mission:</span>
                                    <span className="text-slate-900 font-medium text-right max-w-[200px] truncate">{objective}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Allowed Sites:</span>
                                    <span className="text-emerald-600 font-medium">{allowedSites.length} sites</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Mode:</span>
                                    <span className="text-slate-900 font-medium">{trackingType === 'STRICT' ? '🛡️ Strict' : '⚡ Balanced'}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
                                {isLoading ? 'Starting...' : 'Start Focus Session'}
                            </button>

                            <p className="text-xs text-slate-400 text-center">
                                🔒 Non-whitelisted sites will be instantly blocked
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default MissionBriefing;
