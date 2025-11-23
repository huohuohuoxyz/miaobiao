export interface Lap {
  id: number;
  endTime: number; // Total elapsed time when lap was pressed
  splitTime: number; // Duration of this specific lap
  lapIndex: number;
}

export enum StopwatchState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED'
}

export type Tab = 'world_clock' | 'alarm' | 'stopwatch' | 'timer';