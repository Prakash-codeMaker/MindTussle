
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ NO API KEY FOUND in .env.local");
        return;
    }
    console.log("✅ Found API Key:", apiKey.substring(0, 8) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Models to test
    const models = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    console.log("🚀 Testing Gemini Models...");

    for (const modelName of models) {
        try {
            console.log(`\nTesting: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Simple text test
            const result = await model.generateContent("Hello, are you online?");
            const response = await result.response;
            console.log(`✅ SUCCESS [${modelName}]: ${response.text().substring(0, 30)}...`);

            // If success, we found a working model!
        } catch (error) {
            console.log(`❌ FAILED [${modelName}]: ${error.message.split('[')[0]}`);
            if (error.message.includes("404")) console.log("   -> Model not found/deprecated");
        }
    }
}

testGemini();
