import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Skill, TimerState } from '../types/skill';

const DEFAULT_TIMER: TimerState = {
  activeSkillId: null,
  isRunning: false,
  startedAt: null,
  accumulatedMs: 0,
};

interface SkillStore {
  skills: Skill[];
  timer: TimerState;
  addSkill: (name: string, icon: string) => void;
  deleteSkill: (id: string) => void;
  startTimer: (skillId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  addManualSession: (skillId: string, startedAt: string, endedAt: string, minutes: number) => void;
  addMinutesToSkill: (skillId: string, minutes: number) => void;
  clearAll: () => void;
}

const getTotalMs = (timer: TimerState): number =>
  timer.accumulatedMs +
  (timer.isRunning && timer.startedAt !== null ? Date.now() - timer.startedAt : 0);

export const useSkillStore = create<SkillStore>()(
  persist(
    (set) => ({
      skills: [],
      timer: DEFAULT_TIMER,

      addSkill: (name, icon) =>
        set((s) => ({
          skills: [
            ...s.skills,
            {
              id: crypto.randomUUID(),
              name,
              icon,
              totalMinutes: 0,
              history: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteSkill: (id) =>
        set((s) => ({
          skills: s.skills.filter((sk) => sk.id !== id),
          timer: s.timer.activeSkillId === id ? DEFAULT_TIMER : s.timer,
        })),

      startTimer: (skillId) =>
        set({
          timer: {
            activeSkillId: skillId,
            isRunning: true,
            startedAt: Date.now(),
            accumulatedMs: 0,
          },
        }),

      pauseTimer: () =>
        set((s) => {
          const { timer } = s;
          if (!timer.isRunning || timer.startedAt === null) return s;
          return {
            timer: {
              ...timer,
              isRunning: false,
              accumulatedMs: timer.accumulatedMs + (Date.now() - timer.startedAt),
              startedAt: null,
            },
          };
        }),

      resumeTimer: () =>
        set((s) => ({
          timer: { ...s.timer, isRunning: true, startedAt: Date.now() },
        })),

      stopTimer: () =>
        set((s) => {
          const { skills, timer } = s;
          const { activeSkillId } = timer;
          if (!activeSkillId) return s;

          const now = Date.now();
          const totalMs = getTotalMs(timer);
          const minutes = Math.floor(totalMs / 60000);

          // Discard sessions shorter than 1 minute
          if (minutes < 1) return { timer: DEFAULT_TIMER };

          const session = {
            id: crypto.randomUUID(),
            startedAt: new Date(now - totalMs).toISOString(),
            endedAt: new Date(now).toISOString(),
            minutes,
          };

          return {
            skills: skills.map((sk) =>
              sk.id === activeSkillId
                ? { ...sk, totalMinutes: sk.totalMinutes + minutes, history: [session, ...sk.history] }
                : sk
            ),
            timer: DEFAULT_TIMER,
          };
        }),

      addManualSession: (skillId, startedAt, endedAt, minutes) =>
        set((s) => ({
          skills: s.skills.map((sk) =>
            sk.id === skillId
              ? {
                  ...sk,
                  totalMinutes: sk.totalMinutes + minutes,
                  history: [
                    { id: crypto.randomUUID(), startedAt, endedAt, minutes },
                    ...sk.history,
                  ],
                }
              : sk
          ),
        })),

      addMinutesToSkill: (skillId, minutes) =>
        set((s) => ({
          skills: s.skills.map((sk) =>
            sk.id === skillId
              ? {
                  ...sk,
                  totalMinutes: sk.totalMinutes + minutes,
                  history: [
                    {
                      id: crypto.randomUUID(),
                      startedAt: new Date(Date.now() - minutes * 60000).toISOString(),
                      endedAt: new Date().toISOString(),
                      minutes,
                    },
                    ...sk.history,
                  ],
                }
              : sk
          ),
        })),

      clearAll: () => set({ skills: [], timer: DEFAULT_TIMER }),
    }),
    {
      name: 'skill-tracker-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
