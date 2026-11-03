# Product Requirements Document (PRD)
## Project: GeoPulse — Interactive Map-Based Chatbot & Commute Intelligence

### Document Version: 1.0.0 · Target: Web (PWA)

---

## 1. Executive Summary

Modern commuters juggle fragmented tools: static maps, calendars without travel buffers, and assistants without spatial grounding. GeoPulse unifies:

1. Interactive map + multi-modal routing
2. Search-grounded AI (Gemini + Google Search)
3. Proactive leave-by alerts against appointments
4. Offline cache of routes and pins
5. WebAuthn lock and local GDPR export/erase

---

## 2. Personas

- **Elena** — executive, needs calendar-aware leave-by alerts
- **Marcus** — transit/bike, needs multi-modal steps and live conditions
- **Aisha** — ops admin, needs anonymized metrics and compliance tools

---

## 3. Functional Requirements (summary)

| ID | Area | Requirement |
|----|------|-------------|
| FR-1 | Map | Pan/zoom, pin, categories, multi-modal routes, step directions |
| FR-2 | Chat | Gemini + googleSearch grounding, citations, optional pin-from-suggestion |
| FR-3 | Alerts | Appointments, leave-by = duration + buffer, Web Notifications |
| FR-4 | Offline | localStorage routes/pins/events; offline simulator |
| FR-5 | Security | WebAuthn lock, JSON export, one-click purge |
| FR-6 | Dashboard | Counts and activity log from real local data |
| FR-7 | A11y/i18n | High contrast; en/es/fr/de/ja/sw |

---

## 4. Non-functional

- Dark-first UI, WCAG-oriented contrast modes
- API key server-only (`GEMINI_API_KEY`)
- No default pins/alerts (privacy by default)

See also: `02-technical-architecture.md`, `03-app-flow.md`, in-app Specifications tab.
