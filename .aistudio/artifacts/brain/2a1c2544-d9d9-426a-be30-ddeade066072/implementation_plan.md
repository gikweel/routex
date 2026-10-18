# Implementation Plan: GeoPulse AI - Interactive Map Chatbot & Commute Intelligence

GeoPulse AI is a cross-platform, location-intelligent assistant and commute orchestration platform that pairs real-time Google Search grounding (via Gemini 3.8 Flash) with interactive mapping, multi-modal routing, Google Calendar appointment synchronization, push commute alerts, and administrative performance analytics.

## Executive Summary & System Goals

- **Interactive Map & AI Grounding**: Real-time conversational agent capable of querying current place data, transit disruptions, opening hours, and regional conditions using Google Search Grounding.
- **Commute Orchestration**: Proactive departure alerts calculated against live transit metrics and Google Calendar events to ensure on-time meeting arrivals.
- **Offline Reliability**: IndexedDB and Service Worker caching ensuring routes, pins, and recent commute schedules are viewable with zero connectivity.
- **Enterprise Security & Privacy**: Biometric authentication (FaceID/TouchID WebAuthn simulation), end-to-end data export, GDPR Article 17 "Right to Erasure" controls, and cookie consent audit.
- **Administrative Intelligence**: In-depth analytics dashboard visualizing route congestion trends, engagement cohorts, push notification performance, and automated weekly commute reports.

---

## Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GeoPulse AI Web Application                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴──────────────────────────────┐
    ▼                                                              ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│     Client Frontend (React)   │              │   Server Proxy (/api routes)  │
├───────────────────────────────┤              ├───────────────────────────────┤
│ • Interactive Map (Leaflet)   │              │ • /api/chat: Gemini 3.8 Flash │
│ • Conversational Chatbot      │◄─── REST ───►│   with Google Search tool     │
│ • Route Planner & Directions  │              │ • /api/calendar: Sync Feed    │
│ • Calendar Synced Alarms      │              │ • /api/commute: Alert Engine  │
│ • Offline Cache (IndexedDB)   │              │ • /api/analytics: Aggregation │
│ • Biometric Guard (WebAuthn)  │              │ • /api/gdpr: Export & Purge   │
│ • Analytics & Admin Dashboard │              └──────────────┬────────────────┘
│ • Multi-language i18n & A11y  │                             │
│ • Documentation Explorer      │                             ▼
└───────────────────────────────┘              ┌───────────────────────────────┐
                                               │   External APIs & Engine      │
                                               ├───────────────────────────────┤
                                               │ • Google Gen AI (Gemini 3.8)  │
                                               │ • Google Search Grounding     │
                                               │ • OpenStreetMap Tile Servers  │
                                               └───────────────────────────────┘
```

---

## Key Modules & Implementation Strategy

### 1. Interactive Map Engine (`src/components/MapCanvas.tsx`)
- Embeds a high-performance Leaflet canvas with custom styled pins, polylines, pulsing user location markers, and click-to-pin interactivity.
- Supports pinpointing custom locations, calculating multi-modal routes (Driving, Transit, Bicycling, Walking), elevation profiles, and step-by-step turn directions.
- Provides layer toggles: Traffic Congestion Heatmap, Satellite/Standard, and Collaborator Presence markers.

### 2. Search-Grounded AI Copilot (`src/components/ChatDrawer.tsx`)
- Powered by `gemini-3.8-flash` with `{ googleSearch: {} }` grounding via the server-side `/api/chat` proxy.
- Grounding citations and source URLs are parsed and rendered as verified badges.
- Location queries automatically center the map, drop interactive pins, and compute route suggestions when destinations are mentioned.

### 3. Commute Alerts & Calendar Sync (`src/components/CommuteAlerts.tsx`)
- Synchronizes with Google Calendar appointments, extracting meeting locations, scheduled start times, and required departure windows.
- Automatically calculates "Leave By" alarms factoring in simulated congestion and buffer times.
- Integrates browser Web Notifications API and an in-app visual alert simulator with audible chime.

### 4. Offline Persistence Engine (`src/services/storage.ts`)
- Leverages IndexedDB and localStorage to store saved routes, pinned locations, offline tile bounds, and user preferences.
- Provides a dedicated "Offline Mode" simulator toggle to test zero-network route viewing.

### 5. Security, Biometrics & GDPR Compliance (`src/components/SecurityCenter.tsx`)
- Biometric authentication modal simulating TouchID/FaceID credentials to guard sensitive routes and calendar schedules.
- Complete GDPR data export (`Export My Data` JSON dump) and one-click data erasure.

### 6. Admin Analytics Dashboard (`src/components/AdminDashboard.tsx`)
- Visualizes daily active commute users, top congested corridors, alert engagement open rates, and weekly performance trends.
- Automated push notification campaign test dispatcher and downloadable summary report.

### 7. Documentation Explorer (`src/components/DocsViewer.tsx`)
- Embedded in-app viewer allowing users and evaluators to inspect all 7 extensive specifications directly inside the running application.
