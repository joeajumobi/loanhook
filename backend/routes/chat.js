import express from 'express';
const router = express.Router();

router.post('/ask', async (req, res) => {
  console.log("--- CHAT REQUEST RECEIVED ---");
  
  try {
    const { message, userData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ text: "API Key missing." });

    // Ensure we are pulling the correct readinessScore from userData
    const income = userData?.income || 5200;
    const readinessScore = userData?.readinessScore || 72; // Changed from .score to .readinessScore

    const modelsToTry = [
      "gemini-3-flash-preview", 
      "gemini-3.1-flash-lite-preview", 
      "gemini-1.5-flash-latest"
    ];

    let aiText = "";
    let success = false;

    for (const modelName of modelsToTry) {
      console.log(`Trying ${modelName}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are LoanHook AI. 
              CONTEXT: User has a Monthly Income of $${income} and a Loan Readiness Score of ${readinessScore}/100. 
              INSTRUCTIONS: Be extremely concise. Give a 2-3 sentence response max. 
              Always reference their specific score if they ask about their chances.
              Question: ${message}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500, // Shortened to keep it "concise" as per your instructions
            temperature: 0.7
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
        console.log(`Success with ${modelName} ✅`);
        success = true;
        break; 
      } else {
        console.warn(`${modelName} failed or returned empty: ${data.error?.message}`);
      }
    }

    if (success) {
      res.json({ text: aiText });
    } else {
      res.status(429).json({ text: "AI is busy. Please wait 60 seconds." });
    }

  } catch (error) {
    console.error("DETAILED ERROR:", error.message);
    res.status(500).json({ text: "Connection error. Check backend logs." });
  }
});

export default router;