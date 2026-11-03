# RouteX / GeoPulse

**GeoPulse** is a responsive map-based navigation and commute orchestration web app. Interactive map, multi-modal directions, search-grounded AI assistant (Gemini + Google Search), proactive departure alerts, offline cache, WebAuthn lock, and local GDPR-style data controls.

Repository: [mwasgibson/routex](https://github.com/mwasgibson/routex)

---

## Features

| Area | What you get |
|------|----------------|
| **Map & waypoints** | Leaflet canvas, click-to-pin, reverse geocode-style coords, multi-modal routes (transit / drive / bike / walk), step directions, share via Web Share or URL |
| **Grounded assistant** | Server-side Gemini (`gemini-3.8-flash`) with Google Search grounding and source citations |
| **Commute alerts** | Appointments + “leave by” times (travel duration + buffer), Web Notifications + in-app banner/chime |
| **Offline** | Routes, pins, and events in `localStorage`; header offline simulator |
| **Security & privacy** | WebAuthn screen lock, JSON export, one-click local wipe; no default pins/alerts |
| **Dashboard** | Usage counts and activity log from real local data |
| **A11y & i18n** | High-contrast mode; en / es / fr / de / ja / sw |

---

## Stack

- React 19 + TypeScript  
- Tailwind CSS v4  
- Leaflet  
- `@google/genai` (server proxy in Vite middleware)  
- lucide-react, motion  
- Vite 8  

---

## Quick start

```bash
git clone https://github.com/mwasgibson/routex.git
cd routex
cp .env.example .env   # set GEMINI_API_KEY
npm install
npm run dev            # http://localhost:3000
```

Build:

```bash
npm run build
npm run preview
```

---

## Project layout

```
├── docs/                 # PRD, architecture, flow, design, schema, plan, roadmap
├── public/
├── src/
│   ├── components/       # Map, planner, chat, alerts, security, dashboard, …
│   ├── server/           # Vite middleware → /api/chat (Gemini + grounding)
│   ├── services/         # storage, i18n, notifications, WebAuthn
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json          # name: routex @ 0.1.0
└── vite.config.ts
```

---

## Environment

| Variable | Required | Notes |
|----------|----------|--------|
| `GEMINI_API_KEY` | For chat | Server-only; never sent to the client |
| `APP_URL` | Optional | Public base URL for share links |

---

## Privacy

All pins, routes, appointments, and preferences stay in the browser. No location data is stored until the user creates it. Export and erase are available under Security.

License: Apache-2.0
