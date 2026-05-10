# Krishi — System Requirements Document
**Version:** 1.0  
**Last Updated:** May 2026  
**Product:** Krishi — Smart Crop Recommendation System for Indian Farmers

---

## 1. Product Overview

Krishi is a bilingual (Hindi / English) AI-powered web application that analyses a farmer's field conditions and returns personalised crop recommendations, step-by-step cultivation guides, risk assessments, crop rotation advice, and a marketplace shopping list. 

---

## 2. Functional Requirements

### 2.1 Input Collection

| ID | Requirement |
|----|-------------|
| F-01 | System **MUST** collect soil type from a predefined list: Loamy, Sandy, Clay, Black (Regur), Red, Alluvial, Hill. |
| F-02 | System **MUST** collect climate/season: Kharif, Rabi, Zaid. |
| F-03 | System **MUST** collect Indian state/region from a dropdown. |
| F-04 | System **MUST** accept temperature via slider (0–50 °C). |
| F-05 | System **MUST** accept humidity via slider (0–100 %). |
| F-06 | System **MUST** accept annual rainfall via slider (0–3000 mm). |
| F-07 | System **MUST** accept soil fertility level: Low, Medium, High. |
| F-08 | System **MUST** accept water availability: Low, Medium, High. |
| F-09 | System **SHOULD** accept optional field size (acres). |
| F-10 | System **SHOULD** accept optional previous crop (free text) to enable crop rotation advice. |
| F-11 | System **SHOULD** accept optional special conditions / notes (free text, ≤500 chars). |
| F-12 | System **MUST** validate that soil type, season, and region are provided before submission. |

### 2.2 Recommendation Engine

| ID | Requirement |
|----|-------------|

| F-14 | The AI response **MUST** include: top crop with confidence score, 6 alternative crops with match scores, 6 cultivation steps, 4 agronomic insights, a risk assessment, and a 4-item marketplace list. |
| F-15 | If a previous crop is provided, the response **MUST** also include a crop rotation block with ≥2 successor suggestions and a soil benefit description. |
| F-16 | Confidence scores **MUST** range 55–96 % to convey realistic suitability. |

| F-18 | The fallback engine **MUST** use the same response schema as the AI path so the frontend renders identically. |
| F-19 | The API response **MUST** indicate the data source (`_source: "ai"` or `_source: "fallback"`). |

### 2.3 Bilingual Support

| ID | Requirement |
|----|-------------|
| F-20 | All user-facing text **MUST** be available in English (`en`) and Hindi (`hi`). |
| F-21 | The language toggle **MUST** switch UI labels, field names, result copy, and loading messages without page reload. |
| F-22 | When `lang=hi`, all AI-generated prose fields (why, notes, steps, insights, risk reason, rotation benefit) **MUST** be in Devanagari Hindi; JSON keys remain in English. |
| F-23 | The fallback engine **MUST** produce bilingual output matching the AI schema. |

### 2.4 Results Display

| ID | Requirement |
|----|-------------|
| F-24 | The top crop card **MUST** display: name, emoji, confidence ring (animated), season, estimated profit/acre, estimated cost/acre, and a 2-sentence rationale. |
| F-25 | Alternative crops **MUST** be shown as cards with match score bars animated on display. |
| F-26 | Cultivation steps **MUST** be displayed as a numbered list specific to the recommended crop. |
| F-27 | Agronomic insights **MUST** be shown with colour-coded icons (green/yellow/blue/red). |
| F-28 | Risk assessment **MUST** show a badge (Low / Medium / High) with a plain-language reason. |
| F-29 | Marketplace items **MUST** show item name, use case, and approximate price in INR. |
| F-30 | Crop rotation panel **MUST** appear only when a previous crop was entered. |

### 2.5 Report Generation

| ID | Requirement |
|----|-------------|
| F-31 | System **MUST** provide a "Download Report" button that generates a printable HTML/PDF report. |
| F-32 | The report **MUST** include all result sections plus the full field details summary. |
| F-33 | The report **MUST** be generated in the same language as the current UI language toggle. |
| F-34 | The report **MUST** render correctly when printed to paper (A4) via the browser print dialog. |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement |
|----|-------------|

| NF-02 | The fallback engine **MUST** respond within **200 ms**. |
| NF-03 | The frontend **MUST** achieve a Lighthouse Performance score ≥ 85 on mobile. |
| NF-04 | Critical CSS and fonts **SHOULD** be loaded with minimal render-blocking. |

### 3.2 Security

| ID | Requirement |
|----|-------------|

| NF-06 | All API endpoints **MUST** be protected with CORS, limiting origins to configured allowlist. |
| NF-07 | The backend **MUST** apply rate limiting: max 30 requests / IP / 15-minute window. |

| NF-09 | HTTP headers **MUST** include security headers (via Helmet.js): CSP, X-Frame-Options, HSTS, etc. |
| NF-10 | No PII (personally identifiable information) is collected or stored; field data is ephemeral per request. |

### 3.3 Reliability

| ID | Requirement |
|----|-------------|

| NF-12 | The backend **MUST** log all errors with stack traces in development; sanitised messages in production. |
| NF-13 | The frontend **MUST** display a graceful error message if both AI and fallback paths fail. |

### 3.4 Accessibility & Usability

| ID | Requirement |
|----|-------------|
| NF-14 | The application **MUST** be responsive and usable on mobile devices (≥ 360 px viewport width). |
| NF-15 | All form controls **MUST** have visible labels and keyboard accessibility. |
| NF-16 | Colour contrast **MUST** meet WCAG AA for all body text and interactive elements. |
| NF-17 | Loading states **MUST** be communicated to the user with animated feedback and rotating status messages. |

### 3.5 Maintainability

| ID | Requirement |
|----|-------------|
| NF-18 | Backend code **MUST** be modular: routes, services, middleware, and utilities in separate files. |

| NF-20 | The fallback decision logic **MUST** be maintained in a dedicated `fallback` service. |
| NF-21 | Environment-specific configuration **MUST** use `.env` files with a committed `.env.example` template. |

---

## 4. API Contract

### POST `/api/recommend`

**Request Body**
```json
{
  "soil":      "Loamy",
  "climate":   "Kharif",
  "region":    "Madhya Pradesh",
  "fertility": "Medium",
  "water":     "Medium",
  "temp":      28,
  "humidity":  65,
  "rainfall":  900,
  "fieldSize": 3.5,
  "prevCrop":  "Wheat",
  "notes":     "Near river, prone to flooding",
  "lang":      "en"
}
```

**Response (200)**
```json
{
  "success": true,
  "lang": "en",
  "input": { "soil": "Loamy", "climate": "Kharif", ... },
  "result": {
    "_source": "ai",
    "topCrop": {
      "name": "Soybean", "confidence": 86, "emoji": "🌿",
      "why": "...", "profit": "₹22,000–₹30,000 per acre",
      "cost": "₹9,000 per acre", "season": "Sow Jun–Jul, harvest Oct"
    },
    "alternatives": [ { "name": "Maize", "emoji": "🌽", "score": 78, "note": "..." }, ... ],
    "steps": [ "Step 1...", "Step 2...", ... ],
    "insights": [ { "type": "green", "icon": "✅", "title": "Favourable", "text": "..." }, ... ],
    "risk": { "level": "Low", "reason": "..." },
    "marketplace": [ { "item": "Soybean Seeds", "use": "...", "approx_price": "₹120/kg" }, ... ],
    "rotation": {
      "suggestions": [ { "name": "Wheat", "emoji": "🌾", "reason": "..." } ],
      "soilBenefit": "..."
    }
  }
}
```

**Error (400)**
```json
{ "success": false, "errors": ["soil is required"] }
```

**Error (429)**
```json
{ "error": "Too many requests. Please try again after 15 minutes." }
```

---

### POST `/api/report/generate`

**Request Body**
```json
{
  "formData": { "soil": "Loamy", "temp": 28, ... },
  "result":   { "topCrop": { ... }, "alternatives": [...], ... },
  "lang":     "hi"
}
```

**Response (200)** — `Content-Type: text/html` — A complete standalone printable HTML document.

---

### GET `/api/health`

**Response (200)**
```json
{
  "status": "ok",
  "service": "Krishi API",
  "version": "1.0.0",
  "timestamp": "2026-05-10T10:00:00.000Z",
  "uptime": 3600
}
```

---

## 5. Constraints & Assumptions

- The application targets **Indian farmers** and **Indian agricultural conditions** only.
- Language support is limited to **English and Hindi** in v1.0.
- AI crop decisions are advisory only; farmers should consult local Krishi Vigyan Kendra (KVK) or agronomist for high-stakes decisions.
- Field size is optional and does not affect crop selection in v1.0 (reserved for future yield/profit calculation).
- Marketplace prices are approximate INR estimates and should not be treated as market quotes.

---

## 6. Out of Scope (v1.0)

- Weather API integration (current conditions auto-fill)
- Yield quantity prediction
- Government scheme lookup (PM-Kisan, PMFBY)
- Farmer account / history storage
- Push notifications or reminders
- Multi-crop intercropping recommendations
- Regional language support beyond Hindi
