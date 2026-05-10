export interface Session {
  id: string;
  startedAt: string;
  endedAt: string;
  minutes: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  totalMinutes: number;
  history: Session[];
  createdAt: string;
}

export interface TimerState {
  activeSkillId: string | null;
  isRunning: boolean;
  startedAt: number | null;
  accumulatedMs: number;
}
