# Technical Architecture Overview
## Project: GeoPulse AI - Spatially Grounded Commute Intelligence Platform

---

## 1. System Architecture Diagram

```
                                  +------------------------------------+
                                  |         End-User Devices           |
                                  |   (iOS, Android, PWA, Desktop)     |
                                  +------------------+-----------------+
                                                     |
                                            HTTPS / WSS / REST
                                                     |
                                                     v
+--------------------------------------------------------------------------------------------------+
|                                    Client-Side Single Page App                                   |
|                                     (React 19, Tailwind CSS)                                     |
|                                                                                                  |
|   +-------------------+    +--------------------+    +-------------------+    +--------------+   |
|   |   Map Subsystem   |    |  AI Chat Drawer    |    | Commute & Alarms  |    | Admin Engine |   |
|   | • Leaflet Canvas  |    | • Search Grounding |    | • Departure Calc  |    | • Analytics  |   |
|   | • Multi-modal RT  |    | • Citation Badges  |    | • Calendar Sync   |    | • Campaigns  |   |
|   | • Pin Management  |    | • Place Cards      |    | • WebPush Manager |    | • Reports    |   |
|   +---------+---------+    +---------+----------+    +---------+---------+    +-------+------+   |
|             |                        |                         |                      |          |
|             +------------------------+------------+------------+----------------------+          |
|                                                   |                                              |
|                                                   v                                              |
|                                     +---------------------------+                                |
|                                     | Offline Persistence Layer |                                |
|                                     | • IndexedDB Store         |                                |
|                                     | • localStorage Fallback   |                                |
|                                     | • WebAuthn Biometric Encr |                                |
|                                     +-------------+-------------+                                |
+---------------------------------------------------|----------------------------------------------+
                                                    |
                                          API Requests (Proxy)
                                                    |
                                                    v
+--------------------------------------------------------------------------------------------------+
|                                   Server-Side Runtime Layer                                      |
|                                     (Vite Proxy / Express)                                       |
|                                                                                                  |
|   +------------------------+   +------------------------+   +--------------------------------+   |
|   | /api/gemini/chat       |   | /api/calendar/sync     |   | /api/analytics/events          |   |
|   | • GoogleGenAI client   |   | • Ingest appointment   |   | • Aggregated retention metrics |   |
|   | • Search tool config   |   | • Calculate ETA buffer |   | • Congestion heat logs         |   |
|   | • Telemetry User-Agent |   | • Alert dispatcher     |   | • GDPR Export & Purge RPC      |   |
|   +-----------+------------+   +------------------------+   +--------------------------------+   |
+---------------|----------------------------------------------------------------------------------+
                |
                v
+--------------------------------------------------------------------------------------------------+
|                                    External Cloud Services                                       |
|                                                                                                  |
|   +----------------------------------+             +-----------------------------------------+   |
|   | Google Gen AI Cloud Platform     |             | OpenStreetMap & Carto CDN               |   |
|   | • Model: gemini-3.8-flash        |             | • Vector & Raster Basemap Tiles         |   |
|   | • Tool: googleSearch (Live Web)  |             | • Routing & Geometry Vectors            |   |
|   +----------------------------------+             +-----------------------------------------+   |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Frontend Subsystems & Data Flow

### 2.1 Map Component & Canvas Architecture
- **Library**: High-performance Leaflet engine coupled with custom SVG icon generators.
- **Pin Overlay Lifecycle**:
  - User click/tap registers `(lat, lng)`.
  - Geocoding reverse lookup resolves readable street address.
  - Pin is appended to active Pin Collection in memory and persisted into IndexedDB.
  - Pins generate interactive popups offering "Set as Start", "Set as Destination", "Save to Daily Commute", or "Ask AI about this place".
- **Multi-Modal Routing Engine**:
  - Dynamically calculates waypoints, turn instructions, duration in minutes, and distance in kilometers/miles for 4 modes:
    - `DRIVING`: Standard vehicle paths with traffic congestion multipliers.
    - `TRANSIT`: Rail, subway, and bus line connections with departure frequencies.
    - `BICYCLING`: Bike lanes, greenways, and elevation incline graphs.
    - `WALKING`: Pedestrian paths with street crossing waypoints.

### 2.2 Server-Side AI Chatbot & Google Search Grounding
- **Security Constraint**: In compliance with security standards, `@google/genai` is invoked strictly server-side; `process.env.GEMINI_API_KEY` is never leaked to client bundles.
- **Model Selected**: `gemini-3.8-flash` with `{ googleSearch: {} }` enabled in `config.tools`.
- **System Instruction**: Sourced with location awareness, spatial geometry formatting, and real-time transit status parsing.
- **Grounding Chunk Extraction**: Response parsing pulls `groundingChunks` and renders source links with favicon badges directly in the message bubble.

### 2.3 Calendar Sync & Commute Alarm Engine
- **Meeting Ingestion**: Ingests Google Calendar items with attributes: `id`, `title`, `locationAddress`, `lat`, `lng`, `startTime`, `endTime`, `meetingUrl`.
- **Leave-By Formula**:
  $$\text{Departure Time} = \text{Event Start Time} - \text{Estimated Route Travel Time} - \text{User Safety Buffer (e.g. 10m)}$$
- **Traffic Multiplier**: Real-time congestion index (1.0x normal, 1.25x moderate, 1.6x heavy) dynamically scales travel time and shifts departure alarms earlier.
- **Web Push Notifications**: Schedules notifications using browser `ServiceWorkerRegistration.showNotification()` or in-app fallback chime.

---

## 3. Storage & Offline-First Topology

| Data Store | Purpose | Encryption / Privacy | Eviction Policy |
| :--- | :--- | :--- | :--- |
| **IndexedDB (`geopulse_db`)** | Saved routes, pinned locations, offline tile bounding boxes | Client-side encrypted with WebAuthn session key | User purge or manual clear |
| **localStorage** | App preferences, dark mode, high contrast, active language | Plain JSON, zero PII | Persistent across tabs |
| **Session Cache** | In-flight AI chat responses and live collaborator coordinates | Volatile in-memory | Cleared on window reload |

---

## 4. Security, Biometric Authentication & GDPR Protocol

### 4.1 Biometric Authentication (WebAuthn)
- Utilizes the `navigator.credentials.create()` and `navigator.credentials.get()` WebAuthn APIs for TouchID, FaceID, or platform authenticators.
- Biometric lock screen prevents unauthorized viewing of sensitive calendar schedules, daily commute routines, or home/office addresses if the device is left unattended.

### 4.2 GDPR Compliance Controls
- **Article 15 (Right of Access)**: Provides instant in-app data transparency viewer.
- **Article 20 (Data Portability)**: Exports comprehensive user JSON data bundle (`geopulse-user-data-export.json`).
- **Article 17 (Right to Erasure)**: Immediate zero-residue wipe of all stored routes, pins, calendar sync feeds, and telemetry logs.
- **Data Minimization**: Location tracking is opt-in and can be revoked at any time via a dedicated privacy toggle.
