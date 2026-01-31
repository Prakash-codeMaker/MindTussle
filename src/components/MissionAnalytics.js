"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ShieldCheck, Target, Activity } from 'lucide-react';

const MissionAnalytics = ({ history = [] }) => {
    const stats = [
        { label: 'Focus Time', value: '4.2h', subtitle: 'Today', icon: <Clock size={18} />, color: 'from-emerald-500 to-teal-400' },
        { label: 'Shield Health', value: '98%', subtitle: 'Excellent', icon: <ShieldCheck size={18} />, color: 'from-blue-500 to-indigo-400' },
        { label: 'Distractions', value: '3', subtitle: 'Blocked', icon: <AlertTriangle size={18} />, color: 'from-rose-500 to-pink-400' },
        { label: 'XP Earned', value: '1,240', subtitle: '+150 today', icon: <TrendingUp size={18} />, color: 'from-amber-500 to-orange-400' },
    ];

    const weeklyData = [
        { day: 'Mon', focus: 85, drift: 15 },
        { day: 'Tue', focus: 70, drift: 30 },
        { day: 'Wed', focus: 92, drift: 8 },
        { day: 'Thu', focus: 65, drift: 35 },
        { day: 'Fri', focus: 78, drift: 22 },
        { day: 'Sat', focus: 45, drift: 55 },
        { day: 'Sun', focus: 88, drift: 12 },
    ];

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
                    <p className="text-sm text-slate-400 mt-1">Your focus performance at a glance</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-600">Live Tracking</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-slate-100 p-5 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all group"
                    >
                        <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {stat.subtitle}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Weekly Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Weekly Overview</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Focus vs Drift ratio</p>
                        </div>
                        <Activity size={20} className="text-slate-300" />
                    </div>

                    <div className="h-48 flex items-end gap-3 justify-between">
                        {weeklyData.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col gap-1 h-40">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.focus}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                                    />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-400">{item.day}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-emerald-500 rounded-sm" />
                            <span className="text-xs font-medium text-slate-500">Focus Time</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-slate-200 rounded-sm" />
                            <span className="text-xs font-medium text-slate-500">Drift Time</span>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Daily Goal</p>
                            <p className="text-xs text-slate-400">4 hours focus</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Progress</span>
                            <span className="font-bold">78%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '78%' }}
                                transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-slate-400">52 minutes remaining to hit your goal</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Shield Blocks Today</span>
                            <span className="text-sm font-bold text-emerald-400">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Current Streak</span>
                            <span className="text-sm font-bold text-amber-400">5 days 🔥</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionAnalytics;
