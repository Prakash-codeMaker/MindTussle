import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { content, image, apiKey: clientKey, allowedTools } = req.body;
    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({
            safe: true,
            verdict: "DEMO_MODE",
            message: "Add your Gemini API Key in Settings to enable AI analysis.",
            score: 100,
            detectedSites: []
        });
    }

    const modelNames = [
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const allowedList = (allowedTools || []).map(s => s.toLowerCase());
        const allowedStr = allowedList.length > 0 ? allowedList.join(', ') : 'None specified';

        let result = null;

        // Strict PROCTORING prompt for Screen Analysis (Images)
        const imagePrompt = `You are a screen monitoring AI for focus protection. Analyze this screenshot carefully.

TASK: Detect ALL websites, apps, and platforms visible in this screenshot.

Look for:
1. Browser tab titles and URLs
2. Website logos (YouTube, Facebook, Instagram, Reddit, X, TikTok, Netflix, etc.)
3. App windows

USER'S ALLOWED SITES: [${allowedStr}]
USER'S MISSION: ${content || 'Focus on work'}

RULES:
- safe=true ONLY if ALL visible sites are in the allowed list OR are the MindTussle app itself (localhost/mindtussle)
- safe=false if ANY non-allowed site is visible (even in a background tab, small window, or split screen).
- Example: If user has LeetCode (allowed) open AND YouTube (blocked) in another tab/window -> safe=false (DISTRACTED).
- blockedSites MUST contain every detected site that is not in the allowed list.

RETURN EXACT JSON (no markdown):
{
  "safe": boolean,
  "detectedSites": ["site1", "site2"],
  "blockedSites": ["blocked1"],
  "verdict": "PRODUCTIVE" or "DISTRACTED",
  "message": "Brief feedback",
  "score": 1-100
}`;

        // Simple prompt for Text/Objective Analysis
        const textPrompt = `You are MindTussle Guardian. Analyze this activity: "${content}". 
        Mission: Focus. Allowed: [${allowedStr}].
        Return ONLY valid JSON: {"safe": boolean, "verdict": string, "message": string, "score": number}`;

        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                if (image) {
                    result = await model.generateContent([
                        imagePrompt,
                        {
                            inlineData: {
                                data: image.split(",")[1],
                                mimeType: "image/jpeg"
                            }
                        }
                    ]);
                } else {
                    result = await model.generateContent(textPrompt);
                }

                console.log(`[Guardian] Using model: ${modelName}`);
                break;
            } catch (modelError) {
                console.warn(`Model ${modelName} failed:`, modelError.message);
                continue;
            }
        }

        if (!result) {
            return res.status(200).json({
                safe: true,
                verdict: "PRODUCTIVE",
                message: "AI unavailable. Keep focusing!",
                score: 85,
                detectedSites: [],
                blockedSites: []
            });
        }

        const response = await result.response;
        const text = response.text();

        let data;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            data = JSON.parse(jsonStr.replace(/```json|```/g, "").trim());

            // Ensure arrays exist
            data.detectedSites = data.detectedSites || [];
            data.blockedSites = data.blockedSites || [];

        } catch (e) {
            console.error("JSON Parse Error:", e);
            data = {
                safe: true,
                verdict: "PRODUCTIVE",
                message: "Screen analyzed. Stay focused!",
                score: 90,
                detectedSites: [],
                blockedSites: []
            };
        }

        // ---------------------------------------------------------
        // RUTHLESS PROCTORING MODE: JavaScript Logic Override
        // ---------------------------------------------------------

        // 1. Normalize detected sites
        const detected = (data.detectedSites || []).map(s => s.toLowerCase().trim());
        const allowed = allowedList.map(s => s.toLowerCase().trim());
        const blocked = [];

        // 2. Strict Whitelist Check
        if (allowedStr !== 'None specified') {
            detected.forEach(site => {
                // Ignore MindTussle/Localhost/Empty
                if (!site || site.includes('mindtussle') || site.includes('localhost') || site === 'chrome') return;

                // Check if site matches ANY allowed site
                // Fuzzy match: if allowed is "leetcode" and detected is "leetcode - problem 1", it's allowed.
                const isAllowed = allowed.some(a => site.includes(a) || a.includes(site));

                if (!isAllowed) {
                    blocked.push(site);
                }
            });
        }

        // 3. Explicit Distraction Keyword Check (Safety Net)
        const distractionKeywords = ['youtube', 'facebook', 'twitter', 'x.com', 'instagram', 'tiktok', 'netflix', 'amazon', 'reddit', 'twitch', 'discord'];
        detected.forEach(site => {
            if (distractionKeywords.some(k => site.includes(k))) {
                const isExplicitlyAllowed = allowed.some(a => site.includes(a));
                if (!isExplicitlyAllowed && !blocked.includes(site)) {
                    blocked.push(site);
                }
            }
        });

        // 4. Force Override if Blocked Sites Found
        if (blocked.length > 0) {
            console.log("[Guardian] JS Override: Distractions found -> Force Unsafe");
            data.safe = false;
            data.blockedSites = blocked;
            data.message = `Proctor Alert: Unauthorized site detected (${blocked[0]}). Close it immediately.`;
            data.verdict = "DISTRACTED";
        }

        // DEBUG LOGGING
        console.log("--------------------------------------------------");
        console.log(`[Guardian] Analysis Result (Post-Proctor):`);
        console.log(`   Safe: ${data.safe}`);
        console.log(`   Detected: ${detected.join(', ')}`);
        console.log(`   Blocked: ${data.blockedSites?.join(', ')}`);
        console.log("--------------------------------------------------");

        return res.status(200).json(data);
    } catch (error) {
        console.error("Guardian AI Error:", error.message);
        return res.status(200).json({
            safe: true, // Fail open if error
            detectedSites: [],
            blockedSites: []
        });
    }
}
