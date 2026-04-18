import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../auth/store/authStore';
import { Exercise, rowToExercise } from '../types';
import { MuscleGroup, Equipment } from '../../../types/database';

const QUERY_KEY = 'exercises';

export function useExercises(muscleGroup?: MuscleGroup) {
  return useQuery({
    queryKey: [QUERY_KEY, muscleGroup],
    queryFn: async () => {
      let query = supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (muscleGroup) {
        query = query.eq('muscle_group', muscleGroup);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(rowToExercise);
    },
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return rowToExercise(data);
    },
    enabled: !!id,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (input: { name: string; muscleGroup: MuscleGroup; equipment: Equipment }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('exercises')
        .insert({
          name: input.name,
          muscle_group: input.muscleGroup,
          equipment: input.equipment,
          is_custom: true,
          created_by: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToExercise(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
