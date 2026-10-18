# GeoPulse

GeoPulse is a responsive map-based navigation and commute orchestration web application. It combines an interactive cartographic canvas with live Google Search Grounding (powered by Gemini 3.8 Flash), multi-modal directions, proactive departure alerts calculated against scheduled calendar appointments, offline caching, and WebAuthn biometric screen lock.

---

## Key Capabilities

- **Interactive Map & Waypoints**:
  - Pan, zoom, and click anywhere on the map to drop custom locations.
  - Reverse geocoding coordinate resolution.
  - Multi-modal route computation across Transit, Driving, Bicycling, and Walking.
  - Step-by-step turn directions with distance and estimated trip duration.
  - Direct route sharing via Web Share API or shareable URL parameters.

- **Search-Grounded Assistant**:
  - Server-side integration with `@google/genai` using model `gemini-3.8-flash`.
  - Live Google Search Grounding (`googleSearch` tool) to answer location, route, and transit queries.
  - Inline source citations with verified external URLs.

- **Commute & Calendar Departure Alarms**:
  - Add scheduled meetings, trips, or appointments with destination addresses.
  - Dynamic "Leave By" departure calculator factoring in travel duration and configurable safety buffers.
  - User-configured commute alert rules (lead notice time, target arrival time).
  - Push notifications via browser Web Notifications API and synthesized Web Audio electronic chimes.

- **Offline-First Resilience**:
  - All saved routes, custom pins, and appointment records persist in browser local storage.
  - Dedicated offline simulator switch in the header to test zero-network route viewing.

- **Security & Privacy (GDPR Ready)**:
  - Biometric screen lock utilizing WebAuthn / TouchID / FaceID credentials.
  - Article 20 JSON data portability export ("Export Stored Data").
  - Article 17 "Right to Erasure" one-click local data wipe.
  - Zero pre-set tracking: Starts with 0 default pins and 0 active alerts until configured by the user.

- **Usage & Activity Dashboard**:
  - Real-time tabular metrics reflecting actual saved routes, pinned locations, and scheduled events.
  - Chronological activity audit log tracking route calculations, pin additions, and alarms.

- **Accessibility & Internationalization**:
  - High-Contrast Mode toggle for WCAG 2.2 AA visual accessibility.
  - Multi-language localization across 6 languages: English (`en`), Spanish (`es`), French (`fr`), German (`de`), Japanese (`ja`), and Swahili (`sw`).
  - Strict Top Bar Contract and clean, unboxed typography (no AI slop or decorative gimmicks).

---

## Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Cartography & Map Engine** | Leaflet |
| **AI & Grounding SDK** | `@google/genai` (Gemini 3.8 Flash + `googleSearch` tool) |
| **Icons** | `lucide-react` |
| **Build System** | Vite 8 with custom server proxy middleware |
| **Runtime / Tooling** | Node.js, `tsx`, `express` |

---

## Project Structure

```
├── .aistudio/artifacts/brain/2a1c2544-d9d9-426a-be30-ddeade066072/
│   ├── prd.md                    # Product Requirements Document
│   ├── technical_architecture.md # Technical Architecture Overview
│   ├── app_flow.md               # User Journeys & State Flow
│   ├── design_brief.md           # Design System & Accessibility Brief
│   ├── background_schema.md      # Data Models & Schemas
│   ├── implementation_plan.md    # Implementation Plan
│   └── project_roadmap.md        # Comprehensive Project Roadmap
├── index.html                    # Entry HTML with Leaflet styles & meta tags
├── metadata.json                 # Applet metadata & server Gemini capability
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite config & API server middleware plugin
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Main layout & view coordinator
    ├── index.css                 # Global styles & Tailwind imports
    ├── types/
    │   └── index.ts              # Data contracts & entity definitions
    ├── server/
    │   └── apiMiddleware.ts      # Server-side Gemini 3.8 Flash proxy & APIs
    ├── services/
    │   ├── storage.ts            # Persistent storage, audit logs & GDPR tools
    │   ├── i18n.ts               # Multi-language dictionaries
    │   ├── notificationService.ts# Web Notifications API & audio chime
    │   └── webAuthnService.ts    # Biometric WebAuthn authentication
    └── components/
        ├── Header.tsx            # Clean 3-zone top navigation bar
        ├── NavigationTabs.tsx    # Section switcher
        ├── MapCanvas.tsx         # Leaflet map with custom pins & route lines
        ├── RoutePlanner.tsx      # Multi-modal routing & route sharing
        ├── ChatDrawer.tsx        # Search-grounded assistant with citations
        ├── CommuteAlerts.tsx     # Calendar sync & departure alarm scheduler
        ├── AdminDashboard.tsx    # Authentic usage metrics & activity log
        ├── SecurityCenter.tsx    # Biometrics & GDPR export/purge tools
        ├── DocsViewer.tsx        # Embedded specifications hub
        ├── PinModal.tsx          # Custom location creation modal
        ├── BiometricModal.tsx    # Biometric screen lock dialog
        └── InAppNotificationBanner.tsx # Floating departure alert toast
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is provided:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
```

---

## Specifications & Documentation Hub

Comprehensive engineering and design documents are available in the repository under `.aistudio/artifacts/brain/2a1c2544-d9d9-426a-be30-ddeade066072/` and can be viewed or downloaded directly inside the running application under the **Specifications** tab:

1. **Product Requirements Document (`prd.md`)**
2. **Technical Architecture Overview (`technical_architecture.md`)**
3. **Application Flow (`app_flow.md`)**
4. **Design Brief & Standards (`design_brief.md`)**
5. **Data Models & Schema (`background_schema.md`)**
6. **Implementation Plan (`implementation_plan.md`)**
7. **Project Roadmap (`project_roadmap.md`)**

---

## Privacy & License

- **GDPR Compliance**: All user-pinned locations, routes, and appointments are stored locally in the user's browser. No location coordinates or schedules are stored without user action.
- **License**: Apache-2.0
