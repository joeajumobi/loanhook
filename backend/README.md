# 🚀 LoanHook Backend

This is the Node.js/Express server that powers the LoanHook financial platform. It manages the MongoDB connection and provides the AI logic for the **BorrowSmart** assistant.

## 🛠️ Setup Instructions

Follow these steps to get the backend running on your local machine:

### 1. Clone & Install

Open your terminal in the `backend` directory and run:

```bash
npm install

2. Configure Environment Variables
The server requires specific "secrets" to run.

Create a new file named .env in the backend root folder.

Copy the contents of .env.example into your new .env file.

Replace the placeholder values with your own:

MONGO_URI: Your MongoDB connection string.

GEMINI_API_KEY: Your API key from Google AI Studio.

3. Run the Server
You can start the server in development mode (which restarts automatically when you save changes):

Bash
npm start
The server will be live at: http://localhost:5001

🤖 AI Assistant Details (2026 Standards)
The backend is optimized for the Gemini 3 architecture. We use a "Smart Fallback" system to ensure the AI always responds, even if one model is at capacity.

Active Models in order:

gemini-3-flash-preview

gemini-3.1-flash-lite-preview

gemini-1.5-flash-latest

Key Features:
Concise Mode: Responses are strictly limited to 2-3 sentences to keep the UI clean.

Context Aware: The AI knows the user's income ($5,200) and readiness score (78) to provide relevant advice.

⚠️ Troubleshooting
Port 5001 Error: On macOS, "AirPlay Receiver" often uses port 5001. If you get an EADDRINUSE error, go to System Settings > General > AirPlay & Handoff and toggle off AirPlay Receiver.

429 (Quota Exceeded): We are using the Free Tier. if you send too many messages, you will hit a 60-second cooldown.

404 (Model Not Found): Ensure your API Key is from a project that has "Gemini 3" enabled in AI Studio.

🤝 Project Structure
server.js: Main entry point.

routes/chat.js: AI logic and model fallback loop.

models/: MongoDB data schemas.
```
