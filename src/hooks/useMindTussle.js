import { useState, useEffect, useCallback } from 'react';

const useMindTussle = () => {
    const [user, setUser] = useState(null);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState(1);
    const [mission, setMission] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const [settings, setSettings] = useState({
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
        notifications: true,
        theme: 'zen',
        apiKey: ''
    });
    const [history, setHistory] = useState([]);

    // Sync mission status with extension via API
    const syncMissionStatus = useCallback(async (missionData) => {
        try {
            await fetch('/api/mission-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isActive: !!missionData,
                    allowedSites: missionData?.allowedTools || [],
                    mode: missionData?.trackingType || 'STRICT',
                    objective: missionData?.objective || ''
                })
            });
        } catch (e) {
            console.error('Failed to sync mission status:', e);
        }
    }, []);

    // Keep extension synced with mission status (heartbeat)
    useEffect(() => {
        if (!mission) return;

        const interval = setInterval(() => {
            syncMissionStatus(mission);
        }, 5000); // Sync every 5 seconds

        return () => clearInterval(interval);
    }, [mission, syncMissionStatus]);

    useEffect(() => {
        const saved = localStorage.getItem('mindtussle_data_v2');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.user) setUser(data.user);
            if (data.xp) setXp(data.xp);
            if (data.streak) setStreak(data.streak);
            if (data.level) setLevel(data.level);
            if (data.settings) setSettings(data.settings);
            if (data.history) setHistory(data.history);
            if (data.mission) {
                setMission(data.mission);
                syncMissionStatus(data.mission);
            }
        }
    }, [syncMissionStatus]);

    const saveData = (updates) => {
        const current = { user, xp, streak, level, settings, history, mission, ...updates };
        localStorage.setItem('mindtussle_data_v2', JSON.stringify(current));
    };

    const login = (email, name, preferences) => {
        const newUser = { id: Date.now(), email, name: name || 'Focus Warrior' };
        setUser(newUser);
        if (preferences && preferences.objective) {
            const newMission = {
                objective: preferences.objective,
                trackingType: preferences.trackingType || 'STRICT',
                startTime: Date.now(),
                dailyGoal: preferences.dailyGoal || 4,
                allowedTools: preferences.allowedTools || []
            };
            setMission(newMission);
            syncMissionStatus(newMission);
            saveData({ user: newUser, mission: newMission });
        } else {
            saveData({ user: newUser });
        }
    };

    const logout = () => {
        setUser(null);
        syncMissionStatus(null);
        saveData({ user: null });
    };

    const startMission = (objective, trackingType, allowedTools = []) => {
        const newMission = {
            objective,
            trackingType: trackingType || 'STRICT',
            startTime: Date.now(),
            allowedTools: allowedTools
        };
        setMission(newMission);
        syncMissionStatus(newMission);
        saveData({ mission: newMission });
    };

    const endMission = (victory) => {
        if (victory) addXp(200);
        setMission(null);
        setIsBlurred(false);
        syncMissionStatus(null);
        saveData({ mission: null });
    };

    const addXp = (amount) => {
        const newXp = xp + amount;
        const newLevel = Math.floor(newXp / 500) + 1;
        setXp(newXp);
        if (newLevel > level) {
            setLevel(newLevel);
            saveData({ xp: newXp, level: newLevel });
        } else {
            saveData({ xp: newXp });
        }
    };

    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        saveData({ settings: updated });
    };

    return {
        user,
        xp,
        level,
        streak,
        mission,
        isBlurred,
        settings,
        history,
        setIsBlurred,
        startMission,
        endMission,
        updateSettings,
        addXp,
        login,
        logout
    };
};

export default useMindTussle;
