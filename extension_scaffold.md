
// Basic Scaffold for MindTussle Chrome Extension
// File: extension/manifest.json
{
  "manifest_version": 3,
  "name": "MindTussle Sentinel",
  "version": "1.0",
  "description": "Win the fight against screen addiction with real-time automatic tracking.",
  "permissions": ["tabs", "storage", "alarms", "notifications"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/logo.png"
  },
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/*", "*://*.instagram.com/*", "*://*.twitter.com/*", "*://*.tiktok.com/*"],
      "js": ["content.js"]
    }
  ]
}

// File: extension/background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const harmfulSites = ['youtube.com', 'instagram.com', 'twitter.com', 'tiktok.com'];
    const isHarmful = harmfulSites.some(site => tab.url.includes(site));
    
    if (isHarmful) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/logo.png',
        title: 'MindTussle Alert!',
        message: 'Hostile dopamine loop detected. Engaging counter-tactics.',
        priority: 2
      });
    }
  }
});
