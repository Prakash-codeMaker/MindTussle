// MindTussle Tactical Shield - Content Script
// Feedback-only mode: Shows notification when user visits non-whitelisted sites

(function () {
    let banner = null;
    let missionActive = false;
    let allowedSites = [];

    // Check if current site is allowed
    function isCurrentSiteAllowed() {
        const hostname = window.location.hostname.toLowerCase();

        // Always allow MindTussle dashboard
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return true;
        }

        // Check against whitelist
        for (const site of allowedSites) {
            const cleanSite = site.toLowerCase().trim();
            if (hostname.includes(cleanSite) || cleanSite.includes(hostname)) {
                return true;
            }
        }

        return false;
    }

    // Detect current site type for personalized messaging
    function getSiteInfo() {
        const hostname = window.location.hostname.toLowerCase();
        const siteMap = {
            'youtube.com': { name: 'YouTube', icon: '📺' },
            'facebook.com': { name: 'Facebook', icon: '👥' },
            'instagram.com': { name: 'Instagram', icon: '📸' },
            'twitter.com': { name: 'Twitter/X', icon: '🐦' },
            'x.com': { name: 'X', icon: '🐦' },
            'reddit.com': { name: 'Reddit', icon: '🔴' },
            'tiktok.com': { name: 'TikTok', icon: '🎵' },
            'netflix.com': { name: 'Netflix', icon: '🎬' },
            'twitch.tv': { name: 'Twitch', icon: '🎮' },
            'discord.com': { name: 'Discord', icon: '💬' },
        };

        for (const [domain, info] of Object.entries(siteMap)) {
            if (hostname.includes(domain)) return info;
        }
        return { name: hostname, icon: '🌐' };
    }

    // Create feedback notification banner (NO BLUR, just notification)
    function createFeedbackBanner(siteInfo) {
        const div = document.createElement('div');
        div.id = 'mindtussle-feedback-banner';
        div.innerHTML = `
            <style>
                @keyframes mt-slideIn { 
                    from { transform: translate(-50%, -120%); opacity: 0; } 
                    to { transform: translate(-50%, 0); opacity: 1; } 
                }
                @keyframes mt-pulse { 
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 
                    50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 
                }
                #mt-banner * { 
                    box-sizing: border-box; 
                    margin: 0; 
                    padding: 0; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                }
            </style>
            <div id="mt-banner" style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                border-radius: 16px;
                padding: 16px 24px;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
                animation: mt-slideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1), mt-pulse 2s infinite;
                max-width: 500px;
            ">
                <div style="
                    width: 48px; 
                    height: 48px; 
                    background: rgba(255,255,255,0.2); 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    flex-shrink: 0;
                ">
                    <span style="font-size: 24px;">⚠️</span>
                </div>
                <div style="flex: 1; color: white;">
                    <p style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">
                        You're Distracted from Your Mission!
                    </p>
                    <p style="font-size: 13px; opacity: 0.9;">
                        ${siteInfo.icon} ${siteInfo.name} is not in your allowed list. Stay focused!
                    </p>
                </div>
                <button id="mt-dismiss-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 10px 16px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                    white-space: nowrap;
                ">Got it</button>
            </div>
        `;

        // Add dismiss functionality
        setTimeout(() => {
            const btn = document.getElementById('mt-dismiss-btn');
            if (btn) {
                btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.3)';
                btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.2)';
                btn.onclick = () => {
                    div.style.transform = 'translate(-50%, -120%)';
                    div.style.opacity = '0';
                    div.style.transition = 'all 0.3s ease-out';
                    setTimeout(() => div.remove(), 300);
                    banner = null;
                };
            }
        }, 100);

        return div;
    }

    function checkAndShowFeedback() {
        // Only show feedback if mission is active
        if (!missionActive) {
            if (banner) {
                banner.remove();
                banner = null;
            }
            return;
        }

        const isAllowed = isCurrentSiteAllowed();

        // Show feedback banner for non-whitelisted sites
        if (!isAllowed && !banner) {
            const siteInfo = getSiteInfo();
            banner = createFeedbackBanner(siteInfo);
            document.documentElement.appendChild(banner);
            console.log('[MindTussle] Feedback shown for:', window.location.hostname);
        } else if (isAllowed && banner) {
            banner.remove();
            banner = null;
        }
    }

    // Listen for mission status updates from background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'MISSION_UPDATE') {
            missionActive = request.isActive;
            allowedSites = request.allowedSites || [];
            console.log('[MindTussle] Mission:', missionActive ? 'ACTIVE' : 'INACTIVE', 'Allowed:', allowedSites);
            checkAndShowFeedback();
        }
    });

    // Check on page load
    chrome.runtime.sendMessage({ type: 'GET_MISSION_STATUS' }, (response) => {
        if (response) {
            missionActive = response.isActive;
            allowedSites = response.allowedSites || [];
            checkAndShowFeedback();
        }
    });

    console.log('[MindTussle Shield] Feedback mode active on:', window.location.hostname);
})();
