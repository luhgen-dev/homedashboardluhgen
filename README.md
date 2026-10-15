# Subang Jaya Horizon — Ambient iPad Home Assistant Dashboard

An architectural, gesture-driven Home Assistant wall dashboard engineered for wall-mounted iPads and touch tablets. Designed with physical realism, organic glassmorphic lighting, kinetic coverflow navigation, and zero-telemetry low-power screensaver modes.

---

## 🏛️ Architectural Overview

- **Framework**: React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons + Motion (Framer Motion).
- **Backend & State**: Home Assistant WebSocket & REST API client with automatic mock fallback when offline.
- **Zones & Hardware**:
  - **Zone 01 — Living & Media Hall**:
    - Haier Smart Inverter AC (`climate.living_room_hall_ac`) — Eco-cool, whisper fan, target dial.
    - Audiophile Media Suite (`media_player.lg_speaker_s95tr`) — Dolby Atmos / DTS:X soundbar with acoustic profiles (Bass Blast, Cinema, Night Clear).
    - Sheer Vertical Curtains (`cover.living_room_vertical_curtain`) — Dynamic solar diffusion and aperture percentage control.
    - Hall Ceiling Fan (`fan.hall_ceiling_fan`) — Multi-speed DC whisper breeze.
  - **Zone 02 — Dining Area**:
    - Dining Warm Chandelier (`light.dining_pendant`) — Kelvin color-temperature tunable lighting.
    - Morning Coffee Bar (`switch.coffee_machine`) — Boiler pre-heat and status indicator.
  - **Zone 03 — Culinary & Safety**:
    - High-Flow Range Hood (`fan.kitchen_hood`) — Dual-speed extraction with auto-off timer.
    - Gas Hazard & Leak Sentry (`binary_sensor.gas_leak`) — Real-time emergency detection and cut-off.
  - **Zone 04 — Master Bedroom**:
    - Bedroom AC (`climate.bedroom_ac`) — Sleep curve climate control.
    - Bedroom DC Fan (`fan.bedroom_fan`) — Silent sleep airflow.
  - **Zone 05 — Balcony & Utility**:
    - Smart Heat-Pump Clothes Dryer (`sensor.dryer_cycle`) — Moisture sensor and cycle tracker.
    - Central Water Heater (`switch.water_heater`) — Energy-optimized water heating schedule.

---

## 🖐️ Gesture & Touch Ergonomics

1. **Horizontal Swipe Traversal**:
   - Swipe left or right anywhere on the screen or drag the room deck to smoothly glide between rooms.
   - Smooth inertia with directional blur and micro-spring damping.

2. **Holographic Zone Matrix HUD (0.5s Long Press)**:
   - Press and hold anywhere on the screen for **500ms** (or tap the **Zone Matrix** indicator button) to open the HUD.
   - Displays all rooms in a high-density bento grid with live active device badges for one-tap teleportation.

3. **Double-Tap Ambient Screensaver**:
   - Double-tap anywhere to enter/exit the battery-saving organic clock screensaver.
   - Live weather simulation (clear day/night, rain, thunderstorms, overcast haze) with real-time solar declination, moon phase calculations, and touch ripples.

4. **Global Master Controls**:
   - One-tap "All Off" confirmation modal for swift bedtime / departure room lockdown.
   - Connection status indicator with real-time latency ping and instant Home Assistant URL/Token configuration.

---

## 🚀 Running Locally

```bash
# 1. Clone your repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the dashboard.

---

## 🤖 Reviewing with Gemini 4 Argon in Gemini App

To perform an architectural, security, or code audit using **Gemini 4 Argon**:

1. **Push this repo to GitHub** (see instructions below).
2. Open the **Gemini App** (with Google AI Pro / Ultra).
3. Select the **Argon** model (or enable Gemini Code / Workspace / Antigravity).
4. Provide the GitHub repository URL or upload key files (`src/contexts/HomeAssistantContext.tsx`, `src/pages/Dashboard.tsx`, `src/components/dashboard/ZoneCoverflow.tsx`).
5. Prompt suggestion for Argon:
   > *"Perform an architectural review of this Home Assistant iPad dashboard repository. Audit the WebSocket resilience, touch gesture responsiveness, battery-saving sleep states, and Tailwind/Motion rendering performance for wall-mounted tablets."*
