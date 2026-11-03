# Implementation Plan
## Project: GeoPulse / RouteX

### Stack
- React 19 + TypeScript, Vite 8, Tailwind v4
- Leaflet map, lucide-react, motion
- Server: Vite middleware → `/api/chat` via `@google/genai` (gemini-3.8-flash + googleSearch)
- Storage: localStorage (pins, routes, events, prefs, activity log)

### Modules
| Path | Role |
|------|------|
| `src/components/MapCanvas.tsx` | Leaflet + pins + route polyline |
| `src/components/RoutePlanner.tsx` | Multi-modal plan + share |
| `src/components/ChatDrawer.tsx` | Grounded assistant UI |
| `src/components/CommuteAlerts.tsx` | Appointments + leave-by |
| `src/server/apiMiddleware.ts` | Gemini proxy |
| `src/services/storage.ts` | Persistence + GDPR export/purge |
| `src/services/webAuthnService.ts` | Biometric lock |

### Status
MVP features above are implemented in-repo. Package cleaned to `routex@0.1.0`; AI Studio artifacts removed.
