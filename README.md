# NERVE | Agentic Brokerage OS 🧠 ⚡

> **"Your broker executes. Nerve thinks."**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-live_preview-success.svg)
![AI](https://img.shields.io/badge/AI-Gemini_3_Flash-purple.svg)

**NERVE** is a premium, futuristic, AI-powered brokerage co-pilot designed to act as a **Retail Intelligence Layer**. It sits between the trader and the market, enforcing risk discipline, generating strategies via natural language, and deploying an autonomous agent swarm to analyze real-time market data.

It is built to emulate the depth of tools like **yfinance** and **allinvestview** by leveraging **Google Gemini 3** with **Search Grounding** to retrieve live financial metrics (RSI, P/E, Volume) and perform sentiment analysis.

---

## 🚀 Key Features

### 🛡️ Pre-Trade Sentinel
A "Constitution" based risk engine that intercepts orders before execution.
- **Hard Blocks**: Prevents trading if `Max Daily Loss` is exceeded.
- **Anti-Tilt**: Detects "Revenge Trading" patterns (3 losses in 1 hour) and locks the terminal.
- **Notional Checks**: Validates position sizing against your risk profile (Conservative vs Aggressive).

### 🧠 Intelligence Swarm (Live Data)
Replaces static dashboards with an AI agent swarm that performs "Deep Research" on demand.
- **Macro Sentinel**: Scans global interest rates and sector rotation.
- **Technical Hunter**: Retrieves live RSI, MACD, and Volume anomalies (emulating `yfinance`).
- **Fundamentalist**: Analyzes valuations and earnings reports (emulating `allinvestview`).

### ⚡ Strategy Engine
Text-to-Code compiler for algorithmic trading.
- Convert plain English (e.g., *"Buy SPY when RSI < 30 and price > 200 SMA"*) into deployable Python code.

### 📖 RAG Trade Journal
Automated trade "Autopsies".
- The AI analyzes your trade history to detect emotional bias (Fear, Greed).
- Generates constructive feedback loops to improve discipline.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Cyberpunk/Neon Theme)
- **AI Model**: Google Gemini 1.5 Pro / Gemini 3 Flash Preview
- **AI Tools**: Google Search Grounding (for live market data)
- **Backend/Auth**: Supabase
- **Charts**: Recharts

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/nerve-brokerage-os.git
cd nerve-brokerage-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Required for Intelligence Swarm & Market Data
API_KEY=your_google_gemini_api_key_here

# Required for Authentication (Optional for demo UI, required for login)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Server
```bash
npm run dev
```

---

## 🌐 Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. **Crucial**: Add your `API_KEY` in the Vercel **Project Settings > Environment Variables**.
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.

---

*NERVE is a conceptual financial interface. Always trade responsibly.*

