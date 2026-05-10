# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server → http://localhost:5173
npx tsc --noEmit     # Type-check without emitting (run before committing)
npm run build        # tsc + Vite production build
npm run preview      # Serve the production build locally
```

No test runner is configured. Type safety is the primary correctness mechanism — always run `npx tsc --noEmit` before pushing.

## Architecture

Single-page React app with no routing. The whole UI is `Dashboard` → grid of `SkillCard`s.

### State: `src/store/useSkillStore.ts`

One Zustand store, persisted to `localStorage` under key `skill-tracker-v2`. All timer logic lives here. The timer tracks a single active skill at a time via `TimerState`:

```
{ activeSkillId, isRunning, startedAt: number | null, accumulatedMs }
```

Elapsed time = `accumulatedMs + (Date.now() - startedAt)`. This is computed at read-time, not incremented — so pausing and browser-backgrounding both work correctly. `stopTimer` floors to whole minutes and discards sessions < 1 minute.

If the storage schema changes, bump the `name` key (`skill-tracker-v2` → `v3`, etc.) to avoid type conflicts with old persisted data.

### Level System: `src/utils/skillLevel.ts`

Based on the 10,000-hour rule. Formula: `level = 1 + floor(99 × √(minutes / 600,000))`.

- Inverse: minutes to reach level L = `600,000 × ((L-1)/99)²`
- Level 100 = exactly 600,000 minutes (10,000 h)
- 10 rank names, one per tier of 10 levels; Lv.100 gets its own name `萬小時傳奇`

`getTierInfo()` converts `totalMinutes` → `{ filledTiers, tierProgress }` for `SkillLevelBar`, where each of the 10 bar segments represents one tier (10 levels).

### Live Timer Display: `src/hooks/useElapsedTime.ts`

Takes `enabled: boolean` — pass `false` for inactive cards to avoid running 10+ intervals at once. Adds a `visibilitychange` listener to immediately re-sync display when the tab is foregrounded after being backgrounded.

### Key Invariant

`skill.totalMinutes` is the **persisted** total. During an active session, components compute `displayMinutes = skill.totalMinutes + Math.floor(elapsedMs / 60000)` locally and pass that to level/ring calculations. Never write mid-session minutes to the store — only `stopTimer` and `addManualSession` mutate `totalMinutes`.

### Components

- `HourRing` — SVG circle showing `totalMinutes % 60` out of 60. Pure presentational; pass `displayMinutes` not `skill.totalMinutes` when a session is live.
- `SkillLevelBar` — 10-segment Sims-style bar. `level` prop = filled segments (0–10 tiers), not raw level number. Shimmer animation only runs when `isActive && level > 0`.
- `DevPanel` — testing tool, fixed bottom-right. Remove before any public deploy. Has `+55m`, `+83h`, and clear-all actions.
- `ManualEntryModal` — date + start/end time pickers; derives minutes from the diff; rejects end ≤ start.

### Tailwind Custom Animations

Defined in `tailwind.config.js`:
- `animate-shimmer` — translates a gradient strip left-to-right across the filled bar segments
- `animate-glow` — pulses `box-shadow` on the active skill card border
