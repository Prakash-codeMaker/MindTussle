
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

const AuthGate = ({ onAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [objective, setObjective] = useState('');
    const [dailyGoal, setDailyGoal] = useState('4');
    const [allowedTools, setAllowedTools] = useState('LeetCode, ChatGPT, Docs');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && objective) {
            onAuth(email, name, {
                objective,
                dailyGoal,
                allowedTools: allowedTools.split(',').map(s => s.trim())
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-12 text-center"
            >
                <div className="space-y-4 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
                        <Sword className="text-white" size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">MindTussle</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] font-bold italic">The Focus Sovereignty Protocol</p>
                </div>

                <div className="bg-slate-50 border-2 border-slate-100 p-10 rounded-[40px] shadow-sm space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">{isLogin ? 'Welcome Back' : 'Enlist Now'}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ">Enter your credentials to access the Arena.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 px-6 pl-14 focus:outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-700"
                                />
                                <User className="absolute left-5 top-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            </div>
                        )}

                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 px-6 pl-14 focus:outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-700"
                            />
                            <Mail className="absolute left-5 top-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        </div>

                        <div className="space-y-4 pt-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block text-left pl-2">Current Combat Objective</label>
                            <textarea
                                placeholder="What do you want to achieve in the next few hours?"
                                required
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold text-slate-700 h-24 resize-none shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block text-left pl-2">Daily Goal (Hrs)</label>
                                <input
                                    type="number"
                                    value={dailyGoal}
                                    onChange={(e) => setDailyGoal(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block text-left pl-2">Allowed Tools</label>
                                <input
                                    type="text"
                                    placeholder="LeetCode, ChatGPT..."
                                    value={allowedTools}
                                    onChange={(e) => setAllowedTools(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 transition-all text-[10px] font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!objective || !email}
                            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 group disabled:opacity-30"
                        >
                            Establish Governance
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-4">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already enlisted? Log In"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-bold">End-to-End Visual Encryption</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthGate;
