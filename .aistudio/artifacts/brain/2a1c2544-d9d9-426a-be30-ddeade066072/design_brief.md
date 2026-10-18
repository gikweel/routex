# Design Brief: GeoPulse AI
## Aesthetic Constitution, Design System & Accessibility Blueprint

---

## 1. Visual Direction & Aesthetic Philosophy

GeoPulse AI is styled with a **precision cyber-cartographic aesthetic**: dark-mode first, ultra-legible, utilitarian yet elevated with luminous emerald (`#10b981`), electric cyan (`#06b6d4`), and warning amber (`#f59e0b`) accents. 

It rejects generic corporate templates in favor of a clean, aeronautical instrument dashboard inspired by modern aerospace navigation systems and Bloomberg-grade terminal density, balanced with intuitive consumer touch ergonomics for iOS and Android devices.

---

## 2. Color Palette & Theming Tokens

### 2.1 Dark Mode (Primary Theme)
- **Base Canvas (`--bg-primary`)**: `#0b0f17` (Deep Obsidian Void)
- **Surface Elevation 1 (`--bg-surface`)**: `#111827` (Rich Night Slate)
- **Surface Elevation 2 (`--bg-card`)**: `#1f2937` (Cool Graphite)
- **Border Trim (`--border-subtle`)**: `#374151` / `rgba(255, 255, 255, 0.08)`
- **Accent Primary (`--accent-primary`)**: `#10b981` (Luminous Cyber Emerald)
- **Accent Secondary (`--accent-secondary`)**: `#06b6d4` (Hyperlink Cyan)
- **Alert & Transit Delay (`--alert-warning`)**: `#f59e0b` (Amber Amber-Light)
- **Critical / Departure Now (`--alert-urgent`)**: `#ef4444` (Crimson Pulse)
- **Text Primary (`--text-main`)**: `#f9fafb` (High-contrast pure white)
- **Text Muted (`--text-subtle`)**: `#9ca3af` (Muted silver gray)

### 2.2 Light Mode (Alternative)
- **Base Canvas**: `#f8fafc` (Clean Alabaster)
- **Surface Elevation 1**: `#ffffff` (Pure White Card)
- **Border Trim**: `#e2e8f0`
- **Text Primary**: `#0f172a` (Slate Navy)
- **Text Muted**: `#64748b`

### 2.3 High-Contrast Accessibility Mode
- Contrast ratio exceeding **8.5:1** across all interactive elements, with thick 2px solid boundary borders and bright yellow/white selection indicators for low-vision and visually impaired users.

---

## 3. Typography & Hierarchy

- **Primary Font Family**: Clean sans-serif system stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Monospace Numerical Accent**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` for clock departure times, GPS coordinates, ETA minutes, and travel durations to ensure tabular alignment.
- **Scale Hierarchy**:
  - `Hero / Screen Titles`: `text-xl md:text-2xl font-bold tracking-tight`
  - `Section Headers`: `text-sm font-semibold uppercase tracking-wider text-emerald-400`
  - `Body / Descriptions`: `text-sm leading-relaxed text-slate-300`
  - `Metadata / Tags`: `text-xs font-mono font-medium`

---

## 4. Layout & Spatial Composition

### 4.1 Desktop Viewport
- **Split-Pane Ergonomics**:
  - Full-height interactive map canvas filling the central and right viewport.
  - Collapsible left-hand control dock containing the Tab Navigation (Map, Commute & Calendar, Admin Analytics, Security & GDPR, Documentation).
  - Floating or docked conversational AI Drawer with transparent backdrop blur (`backdrop-blur-md bg-slate-900/85`).

### 4.2 Mobile Viewport (iOS & Android)
- **Full Viewport Map**: The map occupies 100% of the screen height.
- **Bottom Navigation Sheet**: Ergonomic bottom tab bar with thumb-accessible actions.
- **Swipeable Bottom Sheets**: AI Chatbot and Commute Alerts slide up smoothly from the bottom with grab handles, supporting collapsed, half-height, and full-height expansion.

---

## 5. Micro-Interactions & Feedback

- **Map Pin Placement**: Pins drop with a gentle physics bounce and emit a faint concentric radar ping.
- **Route Highlight**: Selected routes pulse softly along the vector line.
- **Departure Countdown**: Dynamic badge changing color from green (>30m) to amber (15-30m) to flashing red (<10m).
- **Biometric Unlock**: Crisp fingerprint / facial recognition scanner animation with satisfying haptic/visual confirmation.
- **Screen Reader Announcements**: `role="status"` and `aria-live="polite"` feedback for every route change and alert trigger.
