// MindTussle Tactical Shield - Background Service Worker
// Polls mission status and broadcasts allowed sites to all tabs

const POLL_INTERVAL = 1000;

let currentMissionState = {
    isActive: false,
    allowedSites: [],
    mode: 'STRICT'
};

async function checkMissionStatus() {
    try {
        const response = await fetch('http://localhost:3000/api/mission-status');
        const data = await response.json();

        currentMissionState = {
            isActive: data.isActive || false,
            allowedSites: data.allowedSites || [],
            mode: data.mode || 'STRICT'
        };

        // Broadcast to all tabs
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (!tab.url) return;

                // Skip internal chrome pages
                if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

                chrome.tabs.sendMessage(tab.id, {
                    type: 'MISSION_UPDATE',
                    isActive: currentMissionState.isActive,
                    allowedSites: currentMissionState.allowedSites,
                    mode: currentMissionState.mode
                }).catch(() => { });
            });
        });

        // Update badge
        if (currentMissionState.isActive) {
            chrome.action?.setBadgeText({ text: '🎯' });
            chrome.action?.setBadgeBackgroundColor({ color: '#10b981' });
        } else {
            chrome.action?.setBadgeText({ text: '' });
        }

    } catch (err) {
        // MindTussle not running - reset state
        currentMissionState = { isActive: false, allowedSites: [], mode: 'STRICT' };
    }
}

// Handle requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_MISSION_STATUS') {
        sendResponse(currentMissionState);
    }
    return true;
});

// Start polling
setInterval(checkMissionStatus, POLL_INTERVAL);
checkMissionStatus();

console.log('[MindTussle Shield] Background worker started');
