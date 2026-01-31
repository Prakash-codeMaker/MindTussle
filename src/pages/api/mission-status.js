// Mission Status API - Provides current mission state to Chrome Extension
// This allows instant URL-based blocking without screen sharing

let globalMissionState = {
    isActive: false,
    allowedSites: [],
    mode: 'STRICT',
    objective: '',
    timestamp: 0
};

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { isActive, allowedSites, mode, objective } = req.body;
        globalMissionState = {
            isActive: isActive || false,
            allowedSites: allowedSites || [],
            mode: mode || 'STRICT',
            objective: objective || '',
            timestamp: Date.now()
        };
        console.log('[Mission Status] Updated:', globalMissionState);
        return res.status(200).json({ success: true });
    }

    // GET: Extension polls this
    // Auto-deactivate if no update for 30 seconds (fail-safe)
    if (globalMissionState.isActive && Date.now() - globalMissionState.timestamp > 30000) {
        globalMissionState.isActive = false;
    }

    res.status(200).json(globalMissionState);
}
