# Application Flow
## Project: GeoPulse

### User Journeys

1. **Explore Map & Directions**
   - Select origin/destination or click map to pin
   - Compute travel time across Transit, Driving, Cycling, Walking
   - Share route via Web Share API or URL params

2. **Search with Google Grounding**
   - Query the assistant for local info or travel options
   - Model returns grounded answers with source URLs

3. **Commute Departure Alarms**
   - Create appointment with start time and location
   - System computes recommended departure time
   - Notification fires at leave-by (banner + optional chime)

4. **Offline Access**
   - Toggle offline simulator in header
   - View saved routes and pins without network

5. **Security**
   - Optional WebAuthn lock on open
   - Export JSON / purge all local data

### Navigation

Tabs: Map · Routes · Alerts · Dashboard · Security · Specs
