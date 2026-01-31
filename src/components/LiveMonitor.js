"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Eye, BrainCircuit, ShieldAlert, ShieldCheck, Loader2, Zap, AlertTriangle, X, Globe, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveMonitor = ({ mission, settings, autoStart, onIntegrityUpdate }) => {
    const [isNeuralLink, setIsNeuralLink] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [driftAlert, setDriftAlert] = useState(null);
    const [detectedSites, setDetectedSites] = useState([]);
    const [blockedSites, setBlockedSites] = useState([]);

    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (autoStart && !isNeuralLink) {
            startNeuralLink();
        }
    }, [autoStart]);

    useEffect(() => {
        return () => stopNeuralLink();
    }, []);

    const startNeuralLink = async () => {
        try {
            setLoading(true);
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: false
            });
            streamRef.current = stream;
            setIsNeuralLink(true);
            setError(null);

            runTacticalLoop();

            setElapsed(0);
            timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);

            stream.getVideoTracks()[0].onended = () => stopNeuralLink();
        } catch (err) {
            console.error(err);
            setIsNeuralLink(false);
            setError("Failed to start screen sharing. Please allow screen sharing.");
        } finally {
            setLoading(false);
        }
    };

    const stopNeuralLink = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
        setIsNeuralLink(false);
        setFeedback(null);
        setError(null);
        setDriftAlert(null);
        setDetectedSites([]);
        setBlockedSites([]);
    };

    const runTacticalLoop = async () => {
        if (!streamRef.current || !streamRef.current.active) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        video.srcObject = streamRef.current;
        await video.play();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.95);

        try {
            const response = await fetch('/api/guardian', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageData,
                    apiKey: settings?.apiKey,
                    content: `USER MISSION: ${mission?.objective || 'Focus on productive work'}`,
                    allowedTools: mission?.allowedTools || []
                })
            });
            const data = await response.json();

            // Update detected sites
            setDetectedSites(data.detectedSites || []);
            setBlockedSites(data.blockedSites || []);

            setFeedback({
                type: data.safe ? 'OPTIMAL' : 'HOSTILE',
                message: data.message,
                verdict: data.verdict
            });

            // Show DRIFT ALERT whenever safe=false (Strict Enforcement)
            if (!data.safe) {
                setDriftAlert({
                    message: data.message,
                    blockedSites: data.blockedSites?.length > 0 ? data.blockedSites : (data.detectedSites || [])
                });
            } else {
                setDriftAlert(null);
            }

            if (onIntegrityUpdate) onIntegrityUpdate(data.score);
            setError(null);

            // Run every 5 seconds for faster detection
            if (streamRef.current && streamRef.current.active) {
                setTimeout(runTacticalLoop, 5000);
            }

        } catch (e) {
            console.error(e);
            setError("Analysis error. Retrying...");
            if (streamRef.current && streamRef.current.active) {
                setTimeout(runTacticalLoop, 8000);
            }
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <>
            {/* DRIFT ALERT - Shows blocked sites detected */}
            <AnimatePresence>
                {driftAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-full px-4"
                    >
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl shadow-2xl shadow-red-500/30 p-5 border border-red-400/30">
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <AlertTriangle size={32} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-white">⚠️ Distraction Detected!</h3>
                                        <button
                                            onClick={() => setDriftAlert(null)}
                                            className="text-white/60 hover:text-white transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <p className="text-white/90 text-sm mb-3">
                                        {driftAlert.message}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {driftAlert.blockedSites?.map((site, i) => (
                                            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">
                                                <Ban size={12} />
                                                {site}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                <video ref={videoRef} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="p-1 px-5 bg-black border-b border-white/5 flex justify-between items-center h-10">
                    <div className="flex items-center gap-3">
                        <Radio size={12} className={isNeuralLink ? 'text-rose-500 animate-pulse' : 'text-emerald-500'} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Screen Monitor</span>
                    </div>
                    {isNeuralLink && (
                        <span className="text-[9px] font-bold text-emerald-400">LIVE</span>
                    )}
                </div>

                <div className="p-8 space-y-6">
                    {!isNeuralLink ? (
                        <div className="space-y-6 text-center py-4">
                            <div className="h-24 w-24 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center text-emerald-500">
                                <Eye size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Start Screen Sharing</h3>
                                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                    AI will detect ALL websites visible on your screen and alert you if any are not in your allowed list.
                                </p>
                            </div>
                            <button
                                onClick={startNeuralLink}
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                                Start Monitoring
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                                    <ShieldAlert size={14} />
                                    {error}
                                </div>
                            )}

                            {/* Mission Info */}
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Your Mission</p>
                                    <p className="text-sm text-white font-medium">{mission?.objective}</p>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400 tabular-nums">{formatTime(elapsed)}</p>
                            </div>

                            {/* Detected Sites */}
                            {detectedSites.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Globe size={14} className="text-blue-400" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Detected on Screen</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {detectedSites.map((site, i) => {
                                            const isBlocked = blockedSites.includes(site);
                                            return (
                                                <span
                                                    key={i}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${isBlocked
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        }`}
                                                >
                                                    {isBlocked ? <Ban size={12} /> : <ShieldCheck size={12} />}
                                                    {site}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <AnimatePresence mode="wait">
                                {feedback ? (
                                    <motion.div
                                        key={feedback.message}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`p-4 rounded-xl border ${feedback.type === 'OPTIMAL'
                                            ? 'border-emerald-500/30 bg-emerald-500/10'
                                            : 'border-rose-500/30 bg-rose-500/10'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {feedback.type === 'OPTIMAL'
                                                ? <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                                                : <ShieldAlert className="text-rose-500 shrink-0" size={20} />
                                            }
                                            <div>
                                                <p className={`text-sm font-medium ${feedback.type === 'OPTIMAL' ? 'text-emerald-400' : 'text-rose-400'
                                                    }`}>
                                                    {feedback.verdict === 'DISTRACTED' ? '🚨 Distraction Detected' : '✅ Focused'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{feedback.message}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                                        Analyzing screen...
                                    </div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={stopNeuralLink}
                                className="w-full py-3 text-slate-500 hover:text-rose-500 transition-colors text-xs font-medium"
                            >
                                Stop Monitoring
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveMonitor;
