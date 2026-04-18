import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExercise } from '../../../features/exercises/hooks/useExercises';
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: exercise, isLoading, error } = useExercise(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#F59E0B" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center px-6">
        <Text className="text-gray-400 text-center">No se pudo cargar el ejercicio.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-amber-500">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color = MUSCLE_GROUP_COLORS[exercise.muscleGroup] ?? '#6B7280';

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg flex-1" numberOfLines={1}>
          {exercise.name}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Color badge */}
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center mb-5"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name="barbell" size={32} color={color} />
        </View>

        <Text className="text-white text-2xl font-black mb-1">{exercise.name}</Text>

        <View className="flex-row gap-2 mb-6">
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: `${color}20` }}
          >
            <Text style={{ color }} className="text-sm font-semibold">
              {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
            </Text>
          </View>
          <View className="bg-gray-800 rounded-full px-3 py-1">
            <Text className="text-gray-300 text-sm">
              {EQUIPMENT_LABELS[exercise.equipment]}
            </Text>
          </View>
          {exercise.isCustom && (
            <View className="bg-amber-500/20 rounded-full px-3 py-1">
              <Text className="text-amber-400 text-sm font-semibold">Personalizado</Text>
            </View>
          )}
        </View>

        {/* Stats placeholder */}
        <View className="bg-gray-900 rounded-2xl p-4">
          <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3">
            Estadísticas
          </Text>
          <Text className="text-gray-600 text-sm">
            Las gráficas de progreso estarán disponibles en la Fase 2.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
