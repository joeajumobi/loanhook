import express from 'express';
const router = express.Router();

router.post('/ask', async (req, res) => {
  console.log("--- CHAT REQUEST RECEIVED ---");
  
  try {
    const { message, userData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ text: "API Key missing." });

    // The 2026 Model List (Matching your working simulator)
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
              text: `You are BorrowSmart AI. User: Income $${userData?.income || 5200}, Score: ${userData?.score || 78}. 
              INSTRUCTIONS: Be extremely concise. Give a 2-3 sentence response max. Use bullet points only if necessary.
              Question: ${message}`
            }]
          }],
          // FIX: Limits the length of the response to save quota and keep it short
          generationConfig: {
            maxOutputTokens: 1000, 
            temperature: 0.7
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        aiText = data.candidates[0].content.parts[0].text;
        console.log(`Success with ${modelName} ✅`);
        success = true;
        break; 
      } else {
        console.warn(`${modelName} failed: ${data.error?.message}`);
      }
    }

    if (success) {
      res.json({ text: aiText });
    } else {
      res.status(429).json({ text: "AI is busy. Please wait 60 seconds." });
    }

  } catch (error) {
    console.error("DETAILED ERROR:", error.message);
    res.status(500).json({ text: "Connection error. Check backend." });
  }
});

export default router;