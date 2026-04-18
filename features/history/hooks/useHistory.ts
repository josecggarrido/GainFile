import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../auth/store/authStore';

export interface WorkoutListItem {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMinutes: number;
  routineName: string | null;
  notes: string | null;
}

export interface WorkoutSetDetail {
  id: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
}

export interface WorkoutExerciseDetail {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSetDetail[];
}

export interface WorkoutDetail {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMinutes: number;
  routineName: string | null;
  notes: string | null;
  exercises: WorkoutExerciseDetail[];
}

type WorkoutListRow = {
  id: string;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
  routine: { name: string } | null;
};

type WorkoutDetailRow = {
  id: string;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
  routine: { name: string } | null;
  sets: Array<{
    id: string;
    set_number: number;
    reps: number | null;
    weight_kg: number | null;
    rpe: number | null;
    exercise_id: string;
    exercise: { name: string; muscle_group: string };
  }>;
};

export function useWorkoutHistory() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async (): Promise<WorkoutListItem[]> => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('workouts')
        .select('id, started_at, finished_at, notes, routine:routines(name)')
        .eq('user_id', user.id)
        .not('finished_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data as unknown as WorkoutListRow[]).map((w) => {
        const start = new Date(w.started_at).getTime();
        const end = new Date(w.finished_at!).getTime();
        return {
          id: w.id,
          startedAt: w.started_at,
          finishedAt: w.finished_at!,
          durationMinutes: Math.round((end - start) / 60000),
          routineName: w.routine?.name ?? null,
          notes: w.notes,
        };
      });
    },
    enabled: !!user,
  });
}

export function useWorkoutDetail(workoutId: string) {
  return useQuery({
    queryKey: ['workout', workoutId],
    queryFn: async (): Promise<WorkoutDetail> => {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          id, started_at, finished_at, notes,
          routine:routines(name),
          sets(id, set_number, reps, weight_kg, rpe, exercise_id,
            exercise:exercises(name, muscle_group))
        `)
        .eq('id', workoutId)
        .single();

      if (error) throw error;

      const row = data as unknown as WorkoutDetailRow;
      const start = new Date(row.started_at).getTime();
      const end = row.finished_at ? new Date(row.finished_at).getTime() : Date.now();

      const exerciseMap = new Map<string, WorkoutExerciseDetail>();
      for (const s of row.sets ?? []) {
        if (!exerciseMap.has(s.exercise_id)) {
          exerciseMap.set(s.exercise_id, {
            exerciseId: s.exercise_id,
            exerciseName: s.exercise.name,
            muscleGroup: s.exercise.muscle_group,
            sets: [],
          });
        }
        exerciseMap.get(s.exercise_id)!.sets.push({
          id: s.id,
          setNumber: s.set_number,
          reps: s.reps,
          weightKg: s.weight_kg,
          rpe: s.rpe,
        });
      }

      return {
        id: row.id,
        startedAt: row.started_at,
        finishedAt: row.finished_at ?? '',
        durationMinutes: Math.round((end - start) / 60000),
        routineName: row.routine?.name ?? null,
        notes: row.notes,
        exercises: Array.from(exerciseMap.values()),
      };
    },
    enabled: !!workoutId,
  });
}
