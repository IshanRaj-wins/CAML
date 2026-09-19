# CAML — Carbon-Aware Machine Learning Scheduling

⚡ A fully interactive, front-end-only dashboard demo for an IDT (Innovation, Design & Thinking) course project. CAML explores how ML workload scheduling can shift compute jobs to run when grid electricity is cleanest — cutting the carbon footprint of AI infrastructure without touching model architecture.

**[Live Demo](#)** — replace with your GitHub Pages link once deployed.

## Overview

CAML is a single-page app (vanilla HTML/CSS/JS, no build step, no backend) that simulates a real-time carbon-aware scheduling platform across four modules:

- **Home** — animated landing page with a live particle canvas hero and an intro to how carbon-aware scheduling works
- **Dashboard** — carbon forecast charts, a workload scheduler, live KPI updates, and toast notifications
- **Logistics** — tabbed views for logistics-specific scheduling scenarios
- **Agriculture** — field monitoring with simulated IoT sensor data (soil moisture, temperature, pH, nitrogen), irrigation scheduling by carbon intensity
- **Admin Panel** — bar/donut charts and a jobs monitor for oversight across all scheduled workloads

> All data shown is simulated client-side — there are no external APIs or backend calls. This is a UI/UX and concept prototype, not a production scheduler.

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no dependencies
- Canvas API for the animated hero particle background and charts
- Google Fonts (Inter)

## Running Locally

No build tools needed — it's static.

```bash
git clone https://github.com/ishanrajwins/<repo-name>.git
cd <repo-name>
# just open index.html in a browser, or serve it locally:
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project Structure

```
.
├── index.html      # All pages/sections (SPA-style, toggled via JS)
├── app.js          # Navigation, charts, simulated data, per-module logic
└── styles.css      # Full styling
```

## Motivation

Training and running ML models carries a real, growing carbon footprint. CAML demonstrates how scheduling workloads around grid carbon-intensity fluctuations — running jobs when renewable supply is high — could meaningfully cut emissions with minimal disruption to SLAs.

## Author

Built by [Ishan Raj](https://github.com/IshanRaj-wins) as an IDT course project at BMSCE.

## License
MIT
