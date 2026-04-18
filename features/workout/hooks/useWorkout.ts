import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../auth/store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { rowToExercise } from '../../exercises/types';

export function useWorkout() {
  const { user } = useAuthStore();
  const store = useWorkoutStore();
  const queryClient = useQueryClient();

  const startWorkout = async (routineId?: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workouts')
      .insert({ user_id: user.id, routine_id: routineId ?? null })
      .select()
      .single();

    if (error) throw error;
    store.startWorkout(data.id, routineId);
    return data.id;
  };

  const startWorkoutFromRoutine = async (routineId: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    const [workoutResult, exercisesResult] = await Promise.all([
      supabase
        .from('workouts')
        .insert({ user_id: user.id, routine_id: routineId })
        .select()
        .single(),
      supabase
        .from('routine_exercises')
        .select('order_index, exercise:exercises(*)')
        .eq('routine_id', routineId)
        .order('order_index'),
    ]);

    if (workoutResult.error) throw workoutResult.error;
    if (exercisesResult.error) throw exercisesResult.error;

    store.startWorkout(workoutResult.data.id, routineId);

    const rows = exercisesResult.data as unknown as Array<{
      order_index: number;
      exercise: Parameters<typeof rowToExercise>[0];
    }>;

    for (const row of rows) {
      store.addExercise(rowToExercise(row.exercise));
    }

    return workoutResult.data.id;
  };

  const finishWorkout = async (notes?: string): Promise<void> => {
    const { activeWorkout } = store;
    if (!activeWorkout) return;

    const completedSets = activeWorkout.exercises.flatMap((entry) =>
      entry.sets
        .filter((s) => s.completed)
        .map((s) => ({
          workout_id: activeWorkout.id,
          exercise_id: entry.exercise.id,
          set_number: s.setNumber,
          reps: s.reps ? parseInt(s.reps, 10) : null,
          weight_kg: s.weightKg ? parseFloat(s.weightKg) : null,
          rpe: s.rpe ? parseFloat(s.rpe) : null,
        }))
    );

    if (completedSets.length > 0) {
      const { error: setsError } = await supabase.from('sets').insert(completedSets);
      if (setsError) throw setsError;
    }

    const { error } = await supabase
      .from('workouts')
      .update({ finished_at: new Date().toISOString(), notes: notes ?? null })
      .eq('id', activeWorkout.id);

    if (error) throw error;

    store.clearWorkout();
    void queryClient.invalidateQueries({ queryKey: ['workouts'] });
  };

  const cancelWorkout = async (): Promise<void> => {
    const { activeWorkout } = store;
    if (!activeWorkout) return;
    await supabase.from('workouts').delete().eq('id', activeWorkout.id);
    store.clearWorkout();
  };

  return {
    activeWorkout: store.activeWorkout,
    startWorkout,
    startWorkoutFromRoutine,
    finishWorkout,
    cancelWorkout,
    addExercise: store.addExercise,
    removeExercise: store.removeExercise,
    addSet: store.addSet,
    removeSet: store.removeSet,
    updateSet: store.updateSet,
    toggleSetComplete: store.toggleSetComplete,
  };
}
