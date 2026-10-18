import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  content: string;
}

const SPECIFICATION_DOCS: DocItem[] = [
  {
    id: 'prd',
    title: 'Product Requirements Document',
    category: 'Product',
    fileName: 'prd.md',
    content: `# Product Requirements Document (PRD)
## Project: GeoPulse - Location Search & Commute Platform

### 1. Overview & Problem Definition
Commuters need an integrated tool to:
1. Search real-world location information and transit options using live search grounding.
2. Plan multi-modal routes across Driving, Public Transit, Bicycling, and Walking.
3. Calculate dynamic departure times based on their scheduled calendar appointments.
4. Cache saved routes and pins locally for offline access.
5. Control personal data with biometric screen lock and GDPR-compliant local data management.

### 2. Functional Requirements
- **FR-1 (Interactive Map & Pinning)**: Interactive map supporting coordinate pinning, custom category tagging, and multi-modal directions.
- **FR-2 (Search Assistant)**: Real-time location search powered by Gemini 3.8 Flash with Google Search Grounding.
- **FR-3 (Calendar Sync & Departure Alerts)**: Scheduled event manager computing departure times factoring in trip duration and user buffers.
- **FR-4 (Offline Cache)**: Saved routes, turn instructions, and pinned locations are stored locally in the browser.
- **FR-5 (Biometric Security & Privacy)**: WebAuthn biometric screen lock, JSON data export, and local data purge.`,
  },
  {
    id: 'architecture',
    title: 'Technical Architecture Overview',
    category: 'Architecture',
    fileName: 'technical_architecture.md',
    content: `# Technical Architecture Overview
## Project: GeoPulse

### 1. Architecture Topology
- **Client (React 19 + TypeScript)**:
  - Interactive Leaflet cartographic canvas.
  - Route planning engine calculating distance, estimated duration, and step directions.
  - Commute alert engine calculating departure countdowns against scheduled calendar items.
  - Local persistence via browser localStorage with offline capability.
  - Hardware biometric authentication via WebAuthn API.
- **Server-Side API Proxy (Vite / Node.js)**:
  - \`/api/chat\`: Invokes \`@google/genai\` server-side using model \`gemini-3.8-flash\` with \`googleSearch: {}\` tool. API keys remain server-side.
- **External Services**:
  - Google Search Grounding for real-time location and transit information.
  - OpenStreetMap & Carto CDN for map tiles.`,
  },
  {
    id: 'app_flow',
    title: 'Application Flow & User Journeys',
    category: 'UX Flow',
    fileName: 'app_flow.md',
    content: `# Application Flow
## Project: GeoPulse

### User Journeys
1. **Explore Map & Directions**:
   - Commuter selects an origin and destination or clicks on the map to add a location.
   - System computes estimated travel time across Transit, Driving, Cycling, or Walking.
   - User can share the route via direct URL.
2. **Search with Google Grounding**:
   - User queries the search assistant for local information or travel options.
   - Model returns factual data grounded in Google Search with verified source URLs.
3. **Commute Departure Alarms**:
   - User creates an appointment with target start time and location.
   - System computes the recommended departure time.
   - Notification alert fires at departure time.
4. **Offline Access**:
   - In offline mode, user can continue viewing their saved routes and pinned locations.`,
  },
  {
    id: 'design_brief',
    title: 'Design Brief & Standards',
    category: 'Design',
    fileName: 'design_brief.md',
    content: `# Design Brief: GeoPulse

### 1. Visual Strategy
- Clean, utilitarian, and high-contrast interface.
- 60-30-10 color allocation: neutral canvas (60%), structural surfaces (30%), subtle accents (10%).
- Anti-slop discipline: No decorative glowing dots, no fake scores, no generic pills on static text.
- Standard sans-serif typography paired with tabular figures for time and numeric data.

### 2. Accessibility
- WCAG 2.2 AA contrast compliance.
- High-contrast mode toggle.
- Clean keyboard navigation.`,
  },
  {
    id: 'schema',
    title: 'Data Models & Schema',
    category: 'Data',
    fileName: 'background_schema.md',
    content: `# Data Models
## Project: GeoPulse

### Core TypeScript Entities
- **PinnedLocation**: id, title, address, lat, lng, category, createdAt.
- **SavedRoute**: id, name, origin, destination, mode, distanceKm, estimatedDurationMins, steps, polylineCoordinates, createdAt.
- **CalendarAppointment**: id, title, locationName, destinationLat, destinationLng, startTime, endTime, travelDurationMins, bufferMins, recommendedDepartureTime, createdAt.
- **CommuteAlertRule**: id, name, enabled, targetArrivalTime, leadNoticeMinutes, weatherAlertsEnabled, transitDisruptionEnabled.
- **UserPreferences**: theme, highContrast, fontSizeScale, language, biometricLockEnabled, offlineSimulation, telemetryConsent.
- **AppActivityLog**: id, type, description, timestamp.`,
  },
  {
    id: 'implementation_plan',
    title: 'Implementation Plan',
    category: 'Plan',
    fileName: 'implementation_plan.md',
    content: `# Implementation Plan: GeoPulse

### Modular Milestones
1. **Map Subsystem**: Leaflet integration, pin creation, multi-modal route calculation.
2. **Search Grounding**: Server-side Gemini 3.8 Flash with Google Search tool.
3. **Commute Alerts & Calendar**: Real user appointment scheduling, dynamic departure calculations, push notifications.
4. **Security & Privacy**: WebAuthn biometric unlock, data export, local data erase.
5. **Analytics**: Real local usage metrics and activity logs.`,
  },
  {
    id: 'roadmap',
    title: 'Project Roadmap',
    category: 'Roadmap',
    fileName: 'project_roadmap.md',
    content: `# Project Roadmap: GeoPulse

### Phases
- **Phase 1 (Core)**: Map canvas, multi-modal directions, local pin storage.
- **Phase 2 (Commute Alarms)**: Calendar appointment scheduling and departure notifications.
- **Phase 3 (Live Search)**: Google Search Grounding for real-time queries.
- **Phase 4 (Security & Privacy)**: Biometric lock and data portability.
- **Phase 5 (Next)**: Additional transit feed integrations and route export formats.`,
  },
];

export const DocsViewer: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>('prd');
  const activeDoc = SPECIFICATION_DOCS.find((d) => d.id === selectedDocId) || SPECIFICATION_DOCS[0];

  return (
    <div className="flex flex-col md:flex-row h-full max-w-5xl mx-auto w-full p-6 gap-6 text-neutral-200">
      {/* Sidebar List */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 border-r border-neutral-800 pr-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 block">
          Documents
        </span>

        {SPECIFICATION_DOCS.map((doc) => {
          const isSelected = doc.id === selectedDocId;
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                isSelected
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <span className="truncate">{doc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Reader */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-white">{activeDoc.title}</h2>
            <span className="text-xs text-neutral-500 font-mono">{activeDoc.fileName}</span>
          </div>

          <button
            onClick={() => {
              const blob = new Blob([activeDoc.content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = activeDoc.fileName;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="py-1 px-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

        <div className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap font-sans">
          {activeDoc.content}
        </div>
      </div>
    </div>
  );
};
