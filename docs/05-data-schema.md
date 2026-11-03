# Data Schema: GeoPulse

Local-first entities stored in browser localStorage.

## Entities

### PinnedLocation
- id, title, category, lat, lng, notes, createdAt

### SavedRoute
- id, origin, destination, mode (transit|driving|bicycling|walking), steps[], distance, duration, createdAt

### CalendarAppointment
- id, title, location, startTime, bufferMinutes

### CommuteAlertRule
- id, appointmentId, leadMinutes, enabled

### UserPreferences
- language, highContrast, offlineSimulation, biometricEnabled

### AppActivityLog
- id, type, message, timestamp

All personal data remains client-side. Export/erase via Security Center (GDPR Art. 20 / Art. 17).
