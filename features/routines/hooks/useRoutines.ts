import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../auth/store/authStore';
import { rowToExercise } from '../../exercises/types';
import { Routine, RoutineDetail, RoutineExercise, RoutineWithCount } from '../types';

type RoutineRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

type RoutineDetailRow = RoutineRow & {
  routine_exercises: Array<{
    id: string;
    routine_id: string;
    order_index: number;
    exercise: {
      id: string;
      name: string;
      muscle_group: string;
      equipment: string;
      is_custom: boolean;
      created_by: string | null;
      created_at: string;
    };
  }>;
};

function rowToRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function useRoutines() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['routines', user?.id],
    queryFn: async (): Promise<RoutineWithCount[]> => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('routines')
        .select('*, routine_exercises(id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as unknown as Array<RoutineRow & { routine_exercises: { id: string }[] }>).map(
        (r) => ({
          ...rowToRoutine(r),
          exerciseCount: r.routine_exercises.length,
        })
      );
    },
    enabled: !!user,
  });
}

export function useRoutineDetail(routineId: string) {
  return useQuery({
    queryKey: ['routine', routineId],
    queryFn: async (): Promise<RoutineDetail> => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises(id, routine_id, order_index, exercise:exercises(*))
        `)
        .eq('id', routineId)
        .single();

      if (error) throw error;

      const row = data as unknown as RoutineDetailRow;
      const exercises: RoutineExercise[] = (row.routine_exercises ?? [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((re) => ({
          id: re.id,
          routineId: re.routine_id,
          orderIndex: re.order_index,
          exercise: rowToExercise(re.exercise as Parameters<typeof rowToExercise>[0]),
        }));

      return { ...rowToRoutine(row), exercises };
    },
    enabled: !!routineId,
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (input: { name: string; description?: string }): Promise<Routine> => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('routines')
        .insert({ user_id: user.id, name: input.name, description: input.description ?? null })
        .select()
        .single();
      if (error) throw error;
      return rowToRoutine(data as unknown as RoutineRow);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      name: string;
      description?: string | null;
    }): Promise<void> => {
      const { error } = await supabase
        .from('routines')
        .update({ name: input.name, description: input.description ?? null })
        .eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['routines'] });
      void queryClient.invalidateQueries({ queryKey: ['routine', vars.id] });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string): Promise<void> => {
      const { error } = await supabase.from('routines').delete().eq('id', routineId);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });
}

export function useAddExerciseToRoutine(routineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string): Promise<void> => {
      const { data: existing } = await supabase
        .from('routine_exercises')
        .select('order_index')
        .eq('routine_id', routineId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextIndex = ((existing as Array<{ order_index: number }> | null)?.[0]?.order_index ?? -1) + 1;

      const { error } = await supabase.from('routine_exercises').insert({
        routine_id: routineId,
        exercise_id: exerciseId,
        order_index: nextIndex,
      });
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['routine', routineId] }),
  });
}

export function useRemoveExerciseFromRoutine(routineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineExerciseId: string): Promise<void> => {
      const { error } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('id', routineExerciseId);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['routine', routineId] }),
  });
}

export function useReorderRoutineExercises(routineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      exercises: Array<{ id: string; orderIndex: number }>
    ): Promise<void> => {
      const updates = exercises.map(({ id, orderIndex }) =>
        supabase
          .from('routine_exercises')
          .update({ order_index: orderIndex })
          .eq('id', id)
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['routine', routineId] }),
  });
}
