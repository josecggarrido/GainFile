import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutDetail } from '../../../features/history/hooks/useHistory';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';
import { MuscleGroup } from '../../../types/database';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: workout, isLoading, error } = useWorkoutDetail(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#F59E0B" />
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center px-6">
        <Text className="text-gray-400 text-center">No se pudo cargar el entrenamiento.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-amber-500">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = workout.exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets.reduce((s, set) => s + (set.reps ?? 0) * (set.weightKg ?? 0), 0),
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg flex-1" numberOfLines={1}>
          {workout.routineName ?? 'Entrenamiento libre'}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Meta */}
        <View className="px-5 py-4">
          <Text className="text-gray-400 text-sm capitalize">{formatDate(workout.startedAt)}</Text>
          <Text className="text-gray-600 text-xs mt-0.5">
            {formatTime(workout.startedAt)} — {formatTime(workout.finishedAt)}
          </Text>
        </View>

        {/* Stats row */}
        <View className="flex-row px-5 gap-3 mb-5">
          <View className="flex-1 bg-gray-900 rounded-2xl p-3 items-center">
            <Ionicons name="time-outline" size={20} color="#F59E0B" />
            <Text className="text-white font-bold mt-1">{formatDuration(workout.durationMinutes)}</Text>
            <Text className="text-gray-500 text-xs">Duración</Text>
          </View>
          <View className="flex-1 bg-gray-900 rounded-2xl p-3 items-center">
            <Ionicons name="barbell-outline" size={20} color="#F59E0B" />
            <Text className="text-white font-bold mt-1">{totalSets}</Text>
            <Text className="text-gray-500 text-xs">Series</Text>
          </View>
          <View className="flex-1 bg-gray-900 rounded-2xl p-3 items-center">
            <Ionicons name="trending-up-outline" size={20} color="#F59E0B" />
            <Text className="text-white font-bold mt-1">
              {totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : '—'}
            </Text>
            <Text className="text-gray-500 text-xs">Volumen</Text>
          </View>
        </View>

        {/* Exercises */}
        <View className="px-5">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Ejercicios ({workout.exercises.length})
          </Text>

          {workout.exercises.map((ex) => {
            const color = MUSCLE_GROUP_COLORS[ex.muscleGroup as MuscleGroup] ?? '#6B7280';
            return (
              <View key={ex.exerciseId} className="bg-gray-900 rounded-2xl mb-3 overflow-hidden">
                <View className="flex-row items-center px-4 pt-3 pb-2">
                  <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: color }} />
                  <View className="flex-1">
                    <Text className="text-white font-bold">{ex.exerciseName}</Text>
                    <Text className="text-gray-500 text-xs">
                      {MUSCLE_GROUP_LABELS[ex.muscleGroup as MuscleGroup]} · {ex.sets.length} series
                    </Text>
                  </View>
                </View>

                {/* Set header */}
                <View className="flex-row px-4 pb-1">
                  <Text className="text-gray-600 text-xs w-6 text-center">#</Text>
                  <Text className="text-gray-600 text-xs flex-1 ml-3">Kg</Text>
                  <Text className="text-gray-600 text-xs flex-1">Reps</Text>
                  <Text className="text-gray-600 text-xs w-12">RPE</Text>
                  <Text className="text-gray-600 text-xs w-14 text-right">Vol.</Text>
                </View>

                {/* Sets */}
                {ex.sets.map((s) => (
                  <View key={s.id} className="flex-row items-center px-4 py-1.5 border-t border-gray-800">
                    <Text className="text-gray-500 font-bold w-6 text-center text-sm">
                      {s.setNumber}
                    </Text>
                    <Text className="text-white text-sm flex-1 ml-3">
                      {s.weightKg != null ? `${s.weightKg}` : '—'}
                    </Text>
                    <Text className="text-white text-sm flex-1">
                      {s.reps != null ? `${s.reps}` : '—'}
                    </Text>
                    <Text className="text-gray-400 text-sm w-12">
                      {s.rpe != null ? `${s.rpe}` : '—'}
                    </Text>
                    <Text className="text-gray-500 text-xs w-14 text-right">
                      {s.reps != null && s.weightKg != null
                        ? `${(s.reps * s.weightKg).toFixed(0)} kg`
                        : '—'}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Notes */}
        {workout.notes && (
          <View className="mx-5 bg-gray-900 rounded-2xl p-4">
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Notas
            </Text>
            <Text className="text-gray-300">{workout.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
