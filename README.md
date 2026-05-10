# 🌾 Krishi — Smart Crop Recommendation System

> AI-powered crop advisory for Indian farmers. Enter your field conditions, get a personalised recommendation in English or Hindi — with cultivation guide, risk assessment, and shopping list.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Frontend Integration](#frontend-integration)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)

---

## Overview

Krishi collects nine field parameters from a farmer (soil type, season, region, temperature, humidity, rainfall, fertility, water availability, and optionally field size + previous crop) and returns:

- **Top Crop Recommendation** with confidence score, profit/cost estimates, and sowing season
- **6 Alternative Crops** with match-score bars
- **Step-by-Step Cultivation Guide** (6 steps, crop-specific)
- **Agronomic Insights** (4 colour-coded tips)
- **Risk Assessment** (Low / Medium / High with explanation)
- **Marketplace Shopping List** (4 items with approximate INR prices)
- **Crop Rotation Advice** (when a previous crop is provided)

All output is available in **English and Hindi**. as the AI backend with a deterministic rule-based fallback engine for offline resilience.

---

## Architecture

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│      Frontend (HTML/JS)     │       │     API                      │
│  krishi-fixed.html          │       │                              │
│                             │       └──────────────┬───────────────┘
│  ┌─────────────────────┐   │                      │
│  │  Field Input Form   │   │       ┌──────────────▼───────────────┐
│  └────────┬────────────┘   │       │      Krishi Backend API       │
│           │ POST /api/     │◄─────►│                              │
│           │ recommend      │       │  ┌────────────────────────┐  │
│  ┌────────▼────────────┐   │       │  │  POST /api/recommend   │  │
│  │  Results Display    │   │       │  │  promptBuilder service  │  │
│  │  - Top Crop Card    │   │       │  │  fallback service       │  │
│  │  - Alt Crops Grid   │   │       │  └────────────────────────┘  │
│  │  - Steps / Insights │   │       │                              │
│  │  - Risk / Market    │   │       │  ┌────────────────────────┐  │
│  │  - Rotation Panel   │   │       │  │  POST /api/report/     │  │
│  └─────────────────────┘   │       │  │       generate         │  │
│                             │       │  │  reportRenderer service │  │
│  ┌─────────────────────┐   │       │  └────────────────────────┘  │
│  │  Download Report    │   │       │                              │
│  └─────────────────────┘   │       │  GET  /api/health            │
└─────────────────────────────┘       └──────────────────────────────┘
```

---

## Project Structure

```
krishi-backend/
├── server.js                   # Express app entry point
├── package.json
├── .env.example                # Environment variable template
│
├── routes/
│   ├── recommend.js            # POST /api/recommend
│   ├── report.js               # POST /api/report/generate
│   └── health.js               # GET  /api/health
│
├── services/
│   ├── promptBuilder.js        # Builds API prompt from field data
│   ├── fallback.js             # Rule-based fallback recommendation engine
│   └── reportRenderer.js      # Generates printable HTML report
│
├── middleware/
│   ├── validate.js             # Request body validation
│   ├── errorHandler.js         # Global error handler
│   └── requestLogger.js       # Structured request logging
│
├── utils/
│   └── sanitize.js             # Input sanitisation & normalisation
│
└── docs/
    └── REQUIREMENTS.md         # Full functional & non-functional requirements
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- An **API key** — get one at [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/krishi-backend.git
cd krishi-backend

# Install dependencies
npm install
```

### Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit .env and set your values
nano .env
```

Required variables:

| Variable            | Description                             | Example                        |
|---------------------|-----------------------------------------|--------------------------------|
| `NODE_ENV`          | Runtime environment                     | `development` / `production`   |
| `PORT`              | Port to listen on                       | `3001`                         |
| `API_KEY` | Your Anthropic API key                  | `sk-ant-...`                   |
| `ALLOWED_ORIGINS`   | Comma-separated CORS-allowed origins    | `http://localhost:3000`        |

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:3001`. Verify with:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{ "status": "ok", "service": "Krishi API", "version": "1.0.0", ... }
```

---

## API Reference

### `POST /api/recommend`

Returns a full crop recommendation for given field conditions.

**Request**

```bash
curl -X POST http://localhost:3001/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "soil": "Loamy",
    "climate": "Kharif",
    "region": "Madhya Pradesh",
    "fertility": "Medium",
    "water": "Medium",
    "temp": 28,
    "humidity": 65,
    "rainfall": 900,
    "fieldSize": 3,
    "prevCrop": "Wheat",
    "notes": "Near river",
    "lang": "en"
  }'
```

**Required fields:** `soil`, `climate`, `region`, `temp`, `humidity`, `rainfall`  
**Optional fields:** `fertility`, `water`, `fieldSize`, `prevCrop`, `notes`, `lang`

**Response Schema**

```json
{
  "success": true,
  "lang": "en",
  "input": { "soil": "...", "climate": "...", ... },
  "result": {
    "_source": "ai | fallback",
    "topCrop": {
      "name": "string",
      "confidence": 86,
      "emoji": "🌿",
      "why": "string",
      "profit": "₹22,000–₹30,000 per acre",
      "cost": "₹9,000 per acre",
      "season": "string"
    },
    "alternatives": [
      { "name": "string", "emoji": "🌾", "score": 78, "note": "string" }
    ],
    "steps": ["string", "string", "string", "string", "string", "string"],
    "insights": [
      { "type": "green|yellow|blue|red", "icon": "✅", "title": "string", "text": "string" }
    ],
    "risk": { "level": "Low|Medium|High", "reason": "string" },
    "marketplace": [
      { "item": "string", "use": "string", "approx_price": "₹XXX" }
    ],
    "rotation": {
      "suggestions": [
        { "name": "string", "emoji": "🌾", "reason": "string" }
      ],
      "soilBenefit": "string"
    }
  }
}
```

`rotation` is only present when `prevCrop` was provided in the request.

---

### `POST /api/report/generate`

Generates a printable HTML report. Returns `Content-Type: text/html`.

```bash
curl -X POST http://localhost:3001/api/report/generate \
  -H "Content-Type: application/json" \
  -d '{ "formData": { ... }, "result": { ... }, "lang": "hi" }'
```

**Required fields:** `formData` (object), `result` (object with `topCrop`)  
**Optional:** `lang` (`en` or `hi`, default `en`)

---

### `GET /api/health`

```bash
curl http://localhost:3001/api/health
```

---

## How It Works

### 1. Prompt Construction (`services/promptBuilder.js`)

The `buildPrompt()` function encodes all field parameters into a structured English prompt that instructs  to:
- Select the best-matched crop (not default to rice)
- Follow soil-type, season, rainfall, and temperature matching rules
- Return a precise JSON structure with no markdown or backticks
- Respond in Hindi prose (Devanagari) when `lang=hi`

### 2. API Call (`routes/recommend.js`)

```
POST https://api.anthropic.com/v1/messages
model: --------
max_tokens: 2500
```

response is parsed by extracting the first `{` to last `}` in the response text (robust against any preamble).

### 3. Fallback Engine (`services/fallback.js`)

If the  API fails or returns unparseable JSON, the fallback engine uses a multi-condition decision tree:

```
Season (Rabi / cold) → soil type → rainfall → temperature
  ↓
Returns: Mustard / Wheat / Cotton / Bajra / Paddy / Maize
  + 6 alternatives, steps, insights, risk, marketplace
```

The fallback returns the identical schema so the frontend renders without modification.

### 4. Report Rendering (`services/reportRenderer.js`)

A server-side HTML string builder that assembles all result sections into a single printable document with embedded CSS. Opened in a new browser tab by the frontend and triggered via `window.print()`.

---

## Frontend Integration

The existing `krishi-fixed.html` currently calls `https://api.anthropic.com/v1/messages` directly from the browser (which exposes the API key). To integrate with this backend:

**1. Update the fetch call in `krishi-fixed.html`:**

```javascript
// BEFORE (insecure — key exposed in browser)
const resp = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": "sk-ant-..." },
  body: JSON.stringify({ model: "--------------", ... })
});

// AFTER (secure — key stays on server)
const resp = await fetch("http://localhost:3001/api/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    soil, climate, region, fertility, water,
    temp, humidity, rainfall, fieldSize, prevCrop, notes,
    lang: currentLang
  })
});
const data = await resp.json();
const result = data.result;
```

**2. Update the report download call:**

```javascript
const reportResp = await fetch("http://localhost:3001/api/report/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ formData: lastFormData, result: lastResult, lang: currentLang })
});
const html = await reportResp.text();
const win = window.open('', '_blank');
win.document.write(html);
win.document.close();
setTimeout(() => win.print(), 800);
```

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Rate limit | 30 req / 15 min / IP | Edit in `server.js` |
| Request body limit | 10 KB | Edit in `server.js` |
| Max tokens (C100) | 2500 | Edit in `routes/recommend.js` |
| Krishi model | `----------` | Edit in `routes/recommend.js` |
| Notes max length | 500 chars | Edit in `utils/sanitize.js` |

---

## Development

```bash
# Run in dev mode with nodemon
npm run dev

# Lint
npm run lint

# Run tests
npm test

# Test a recommendation (dev)
curl -X POST http://localhost:3001/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"soil":"Black (Regur)","climate":"Kharif","region":"Maharashtra","temp":30,"humidity":70,"rainfall":800,"lang":"en"}'
```

---

## Deployment

### Option A — Node.js on a VPS / EC2

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
NODE_ENV=production pm2 start server.js --name krishi-api

# Save process list
pm2 save
pm2 startup
```

### Option B — Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

```bash
docker build -t krishi-api .
docker run -d -p 3001:3001 --env-file .env krishi-api
```

### Option C — Render / Railway / Fly.io

Set the environment variables in the platform dashboard and deploy directly from the GitHub repository. The `npm start` command will be used automatically.

**IMPORTANT:** Always set `NODE_ENV=production` and ensure `ANTHROPIC_API_KEY` is a secret environment variable — never committed to version control.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4.x |
| AI Provider | ---------------------------------------- |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan + custom request logger |
| Dev tooling | Nodemon, ESLint, Jest + Supertest |
| Frontend | Vanilla HTML/CSS/JS (single file) |

---

## Roadmap

- [ ] Weather API integration (auto-fill temperature, humidity, rainfall by location)
- [ ] Yield quantity prediction based on field size
- [ ] Government scheme lookup (PM-Kisan, PMFBY, Soil Health Card)
- [ ] Farmer account system with recommendation history
- [ ] Expand language support (Marathi, Tamil, Telugu, Gujarati)
- [ ] Intercropping recommendations
- [ ] Mandi (market) price integration via Agmarknet API
- [ ] SMS/WhatsApp report delivery

---

## License

MIT © Krishi Team

---

*Built to empower Indian farmers with AI-driven agricultural intelligence.* 🌾
