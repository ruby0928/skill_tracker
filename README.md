# Skill Tracker 🎮

A **The Sims-inspired skill tracking app** built as a portfolio side project. Practice any skill and watch your progress bars fill up — one session at a time.

**Live Demo** → *(coming soon via GitHub Pages)*

---

## Features

- **Sims-style 10-segment level bar** — levels 1–10 with an exponential XP curve (1h → 55h total)
- **Session timer** — start, pause, resume, and stop with a single click; elapsed time updates every second
- **Persistent data** — all skills and logs survive page refreshes via `localStorage`
- **Dark dashboard** — responsive card grid with a sticky active-timer banner
- **Animated shimmer** — the level bar glows and scans while you're actively training

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI Framework | React 18 + TypeScript |
| State Management | Zustand 5 (with `persist` middleware) |
| Styling | Tailwind CSS 3 |
| Build Tool | Vite 6 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

---

## Project Structure

```
src/
├── types/skill.ts          # Skill, SkillLog, TimerState interfaces
├── store/useSkillStore.ts  # Zustand store — timer logic & localStorage persistence
├── hooks/useElapsedTime.ts # Live elapsed-ms hook (interval only on active card)
├── utils/skillLevel.ts     # Level curve, formatMinutes, formatElapsedMs
└── components/
    ├── Dashboard.tsx        # Page layout & skill grid
    ├── SkillCard.tsx        # Card with play/pause/stop controls
    ├── SkillLevelBar.tsx    # 10-segment Sims bar + shimmer animation
    ├── ActiveTimerBar.tsx   # Sticky top banner while timer is running
    └── AddSkillModal.tsx    # New-skill modal with emoji picker
```

---

## Level Curve

| Level | Cumulative Hours |
|---|---|
| 1 | 1h |
| 2 | 3h |
| 3 | 6h |
| 4 | 10h |
| 5 | 15h |
| 6 | 21h |
| 7 | 28h |
| 8 | 36h |
| 9 | 45h |
| 10 | 55h |

---

## Roadmap

- [ ] Phase 2 — Log history drawer per skill
- [ ] Phase 3 — Weekly heatmap chart
- [ ] Phase 4 — GitHub Pages deployment + PWA support
