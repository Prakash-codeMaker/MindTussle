import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Timer from '@/components/Timer';
import LiveMonitor from '@/components/LiveMonitor';
import UsageChart from '@/components/UsageChart';
import AuthGate from '@/components/AuthGate';
import MissionAnalytics from '@/components/MissionAnalytics';
import MissionBriefing from '@/components/MissionBriefing';
import Settings from '@/components/Settings';
import useMindTussle from '@/hooks/useMindTussle';
import { Target, Zap, BarChart3, Settings as SettingsIcon, Swords } from 'lucide-react';

export default function Home() {
    const {
        user, xp, level, streak, mission, settings,
        startMission, endMission, updateSettings, addXp, login
    } = useMindTussle();

    const [activeTab, setActiveTab] = useState('arena');

    const onSessionComplete = (mode) => {
        if (mode === 'FOCUS') {
            addXp(150);
            if (mission) endMission(true);
        }
    };

    if (!user) {
        return <AuthGate onAuth={login} />;
    }

    const handleMissionStart = (objective, trackingType, allowedSites = []) => {
        startMission(objective, trackingType || 'STRICT', allowedSites);
    };

    const tabs = [
        { id: 'arena', label: 'Focus Arena', icon: <Swords size={16} /> },
        { id: 'intel', label: 'Analytics', icon: <BarChart3 size={16} /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> },
    ];

    return (
        <Layout theme={settings.theme}>
            {!mission && activeTab === 'arena' && (
                <MissionBriefing onStart={handleMissionStart} />
            )}

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                            <Target size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MindTussle</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={`h-2 w-2 rounded-full ${mission ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-xs font-medium text-slate-400">
                                    {mission ? 'Mission Active' : 'Ready for Mission'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Stats */}
                        <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" fill="currentColor" />
                                <div>
                                    <p className="text-xs text-slate-400">Level</p>
                                    <p className="text-sm font-bold text-slate-900">{level}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div>
                                <p className="text-xs text-slate-400">XP</p>
                                <p className="text-sm font-bold text-slate-900">{xp}</p>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                                        ${activeTab === tab.id
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mission Card */}
                {mission && activeTab === 'arena' && (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Target size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Current Mission</p>
                                <h3 className="text-lg font-bold mt-0.5">{mission.objective}</h3>
                                {mission.allowedTools?.length > 0 && (
                                    <p className="text-xs text-white/70 mt-1">
                                        {mission.allowedTools.length} allowed sites
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => endMission(false)}
                            className="relative z-10 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
                        >
                            End Mission
                        </button>
                    </div>
                )}

                {/* Arena Tab */}
                {activeTab === 'arena' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <Timer
                                settings={settings}
                                onSessionComplete={(mode) => onSessionComplete(mode)}
                            />
                            <div className="bg-white border border-slate-100 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Recent Sessions</h3>
                                    <Zap className="text-amber-500" size={18} />
                                </div>
                                <UsageChart />
                            </div>
                        </div>
                        <LiveMonitor
                            mission={mission}
                            settings={settings}
                            onIntegrityUpdate={(score) => score > 80 && addXp(5)}
                        />
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'intel' && <MissionAnalytics />}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <Settings settings={settings} onUpdate={updateSettings} />
                    </div>
                )}
            </div>
        </Layout>
    );
}
