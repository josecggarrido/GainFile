export type { Database, MuscleGroup, Equipment, Json } from './database';

export interface WorkoutSummary {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMinutes: number;
  routineName: string | null;
  exerciseCount: number;
  totalSets: number;
  totalVolume: number;
}
