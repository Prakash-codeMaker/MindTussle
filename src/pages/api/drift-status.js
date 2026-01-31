// Bridge API for the companion Chrome Extension
// Stores current drift state and enforcement mode

let globalDriftState = {
    isDrifted: false,
    message: '',
    mode: 'STRICT', // STRICT = full block, BALANCED = notification only
    timestamp: 0
};

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { isDrifted, message, mode } = req.body;
        globalDriftState = {
            isDrifted,
            message,
            mode: mode || 'STRICT',
            timestamp: Date.now()
        };
        return res.status(200).json({ success: true });
    }

    // GET: The extension calls this to check status
    // Reset if data is older than 15 seconds (fail-safe)
    if (Date.now() - globalDriftState.timestamp > 15000) {
        globalDriftState.isDrifted = false;
    }

    res.status(200).json(globalDriftState);
}
