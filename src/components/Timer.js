
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Pause, Sword, Coffee, Bell, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Timer = ({ settings, onSessionComplete }) => {
    const [minutes, setMinutes] = useState(settings?.focusTime || 25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('FOCUS'); // FOCUS, SHORT_BREAK, LONG_BREAK
    const [showModal, setShowModal] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        setMinutes(mode === 'FOCUS' ? (settings?.focusTime || 25) :
            mode === 'SHORT_BREAK' ? (settings?.shortBreak || 5) :
                (settings?.longBreak || 15));
        setSeconds(0);
    }, [mode, settings]);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    clearInterval(interval);
                    setIsActive(false);
                    handleTimeUp();
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const handleTimeUp = () => {
        setShowModal(true);
        if (onSessionComplete) onSessionComplete(mode);
        if (settings?.notifications && Notification.permission === 'granted') {
            new Notification(`MindTussle: ${mode === 'FOCUS' ? 'Victory!' : 'Break Over'}`, {
                body: mode === 'FOCUS' ? "Focus session won. Take a well-deserved break." : "Break finished. Ready for the next tussle?",
            });
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(mode === 'FOCUS' ? settings.focusTime : mode === 'SHORT_BREAK' ? settings.shortBreak : settings.longBreak);
        setSeconds(0);
    };

    const calculateProgress = () => {
        const total = (mode === 'FOCUS' ? settings.focusTime : mode === 'SHORT_BREAK' ? settings.shortBreak : settings.longBreak) * 60;
        const current = minutes * 60 + seconds;
        return ((total - current) / total) * 100;
    };

    // Dynamic Color Logic: Transition from Emerald (Green) to Rose (Red)
    const getProgressColor = () => {
        const progress = calculateProgress();
        if (mode !== 'FOCUS') return 'text-blue-500';
        if (progress < 50) return 'text-emerald-500';
        if (progress < 80) return 'text-orange-500';
        return 'text-rose-500';
    };

    const getAuraColor = () => {
        const progress = calculateProgress();
        if (mode !== 'FOCUS') return 'rgba(59, 130, 246, 0.3)';
        if (progress < 50) return 'rgba(16, 185, 129, 0.3)';
        if (progress < 80) return 'rgba(249, 115, 22, 0.3)';
        return 'rgba(244, 63, 94, 0.3)';
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl relative">
            <div className="p-1 px-5 bg-slate-900 flex justify-between items-center h-12 italic italic-bold italic border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <Sword size={16} className={mode === 'FOCUS' ? 'text-emerald-400' : 'text-blue-400'} />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Tactical Objective</span>
                </div>
                <div className="flex items-center gap-1.5 focus-within:ring-2">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isActive ? 'In Combat' : 'Standby'}</span>
                </div>
            </div>

            <div className="p-10 flex flex-col items-center justify-center space-y-12">
                <div className="relative group grayscale-0">
                    {/* Pulsing Aura Effect */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full blur-2xl"
                                style={{ backgroundColor: getAuraColor() }}
                            />
                        )}
                    </AnimatePresence>

                    <div className="w-64 h-64 rounded-full border-[14px] border-slate-50 flex flex-col items-center justify-center relative shadow-inner bg-white z-10 transition-all">
                        <svg className="absolute -rotate-90 w-full h-full p-0">
                            <circle
                                cx="128" cy="128" r="114"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="14"
                                strokeLinecap="round"
                                className={`${getProgressColor()} transition-all duration-1000 ease-linear`}
                                strokeDasharray={2 * Math.PI * 114}
                                strokeDashoffset={2 * Math.PI * 114 * (1 - calculateProgress() / 100)}
                            />
                        </svg>
                        <div className="text-7xl font-black tracking-tighter text-slate-900 tabular-nums italic selection:bg-emerald-100 italic-bold font-black italic">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                        <div className={`text-[12px] font-black uppercase tracking-[0.4em] mt-3 ${mode === 'FOCUS' ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {mode.replace('_', ' ')}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-8 flex flex-col italic items-center">
                    <div className="flex gap-4 w-full justify-center">
                        <button onClick={() => setMode('FOCUS')} className={`flex-1 h-12 rounded-2xl text-[10px] items-center font-black uppercase tracking-widest transition-all ${mode === 'FOCUS' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Arena</button>
                        <button onClick={() => setMode('SHORT_BREAK')} className={`flex-1 h-12 rounded-2xl text-[10px] items-center font-black uppercase tracking-widest transition-all ${mode === 'SHORT_BREAK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Recovery</button>
                    </div>

                    <div className="flex gap-5 w-full">
                        <button
                            onClick={toggleTimer}
                            className={`flex-[3] flex items-center justify-center gap-4 h-20 rounded-2xl font-black text-sm uppercase tracking-[0.25em] transition-all active:scale-95 shadow-xl ${isActive ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}`}
                        >
                            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            {isActive ? 'Pause Tussle' : 'Enter Arena'}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="flex-1 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center border border-slate-200"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Alert */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-xs w-full text-center space-y-6 shadow-2xl scale-layout"
                        >
                            <div className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center ${mode === 'FOCUS' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {mode === 'FOCUS' ? <Sword size={36} /> : <Coffee size={36} />}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic italic-bold italic">
                                    {mode === 'FOCUS' ? 'Session Victory!' : 'Peace Achieved'}
                                </h3>
                                <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                                    {mode === 'FOCUS' ? 'You completed your combat session. Claim your XP.' : 'Your recovery is complete. Ready for more?'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    if (mode === 'FOCUS') setMode('SHORT_BREAK');
                                    else setMode('FOCUS');
                                }}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${mode === 'FOCUS' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}
                            >
                                {mode === 'FOCUS' ? 'Start Recovery' : 'Return to Arena'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Timer;
