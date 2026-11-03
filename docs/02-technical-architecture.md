# Technical Architecture
## Project: GeoPulse / RouteX

### Topology

**Client (React 19 + TypeScript)**
- Leaflet cartographic canvas
- Route planning (distance, duration, steps)
- Commute alert engine (departure countdowns)
- localStorage persistence + offline simulator
- WebAuthn biometric lock

**Server-side API proxy (Vite middleware)**
- `POST /api/chat` → `@google/genai` with model `gemini-3.8-flash` and tool `googleSearch: {}`
- API key from `GEMINI_API_KEY` (never exposed to client)
- User-Agent: `routex/0.1`

**External**
- Google Search Grounding (via Gemini)
- OpenStreetMap / Carto tiles for map

### Security notes
- CORS limited to app origin in production deployments (dev: permissive)
- No location data leaves the browser except explicit chat context coordinates sent with user prompts
