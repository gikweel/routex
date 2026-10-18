# Application Flow & User Journeys
## Project: GeoPulse AI - Interactive Map Chatbot & Commute Intelligence

---

## 1. High-Level User Journey State Diagram

```
                     +----------------------------+
                     |  App Launch / Splash Screen|
                     +--------------+-------------+
                                    |
                    [Biometric Lock Enabled?]
                        /                \
                     (Yes)               (No)
                      /                    \
                     v                      v
         +-----------------------+   +-----------------------+
         | TouchID / FaceID Prompt|  | Home Interactive Map  |
         +-----------+-----------+   +-----------+-----------+
                     | (Success)                 |
                     +---------------------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|  Map Exploration  |     |  AI Chatbot Copilot|    | Commute & Calendar|
| • Pin location    |     | • Location query  |     | • Ingest meetings |
| • Plan Route      |     | • Search Grounding|     | • Compute Leave-By|
| • Mode Switcher   |     | • Place citations |     | • Push alerts     |
+---------+---------+     +---------+---------+     +---------+---------+
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|   Offline Mode    |     |  Admin Dashboard  |     |  Security & GDPR  |
| • Cached routes   |     | • Retention metrics|    | • Export data JSON|
| • Offline pins    |     | • Congestion heat |     | • Right to erase  |
| • Zero-net banner |     | • Weekly reports  |     | • Biometric setup |
+-------------------+     +-------------------+     +-------------------+
```

---

## 2. Core Operational Walkthroughs

### 2.1 Flow 1: Pinned Location to Multi-Modal Route Navigation
1. **User Action**: Commuter taps on any spot on the map or searches for an address in the search bar.
2. **System Response**: A pulsing animated marker appears with the reverse-geocoded title (e.g. "Mission District Hub"). A popup presents options:
   - `Pin this location`: Stores to saved pins with custom category tag.
   - `Route from here`: Sets as origin.
   - `Route to here`: Sets as destination.
   - `Ask AI about this place`: Pre-populates the AI chat drawer.
3. **Route Computation**: When origin and destination are set:
   - App computes travel duration, distance, and turn steps for Driving, Transit, Bicycling, and Walking.
   - Polyline renders in high-contrast cyan on the map.
   - User can tap "Save Route to Commute Alerts".

### 2.2 Flow 2: Sourcing Live Grounded Advice via AI Chatbot
1. **User Action**: User opens the floating AI Chat Drawer and queries: *"What's the best route to Downtown right now, and are there any delays on transit?"*
2. **System Response**:
   - Query is routed via server proxy `/api/chat` to `gemini-3.8-flash` with `{ googleSearch: {} }`.
   - Gemini searches live web indexes for transit alerts, road closures, and current conditions.
   - Result returns formatted summary + verified web grounding citations with external links.
   - If specific coordinate locations are referenced, the AI automatically drops highlighted pins on the map.

### 2.3 Flow 3: Calendar Sync & Proactive Departure Alerts
1. **User Action**: User navigates to the "Commute & Calendar" tab and toggles Google Calendar sync.
2. **System Response**:
   - The app ingests today's scheduled meetings (e.g. "Client Strategy Session @ 10:00 AM at 500 Howard St").
   - Travel duration is computed in real-time (e.g., 22 minutes via Transit + 10 minutes traffic buffer).
   - The alarm engine sets a scheduled alert for `9:28 AM` ("Leave now to arrive on time!").
   - At `9:13 AM` (15 minutes prior) and `9:28 AM`, the system fires a Web Push notification and plays an in-app visual and audio alert.

### 2.4 Flow 4: Seamless Offline Transition
1. **User Action**: The commuter enters an underground subway tunnel or toggles "Simulate Offline Mode" in the header.
2. **System Response**:
   - An amber "Offline Mode Active" badge appears in the top navigation.
   - The app switches from live network requests to reading from local IndexedDB cache.
   - Saved routes, turn instructions, and pinned locations remain instantly viewable.
   - Chat queries switch to local cached knowledge and advise the user that live Search Grounding will resume once reconnected.

### 2.5 Flow 5: Admin Analytics & Retention Campaign Management
1. **User Action**: Administrator selects the "Admin Dashboard" tab.
2. **System Response**:
   - Real-time KPI cards display: Daily Active Commuters (3,420), On-Time Arrival Rate (94.2%), Push Notification Open Rate (78.6%), and Saved Routes (14,890).
   - Interactive charts display congestion corridors and commute modal shares.
   - The admin can draft and preview an automated push campaign (e.g., "Severe Weather Advisory for Evening Commute") and trigger broadcast tests.
   - Admin can generate and download the Automated Weekly Commute Performance Report.
