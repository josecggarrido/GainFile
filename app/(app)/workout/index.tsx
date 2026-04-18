import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkout } from '../../../features/workout/hooks/useWorkout';
import { useRoutines } from '../../../features/routines/hooks/useRoutines';
import { RoutineCard } from '../../../features/routines/components/RoutineCard';

export default function WorkoutScreen() {
  const router = useRouter();
  const { activeWorkout, startWorkout, startWorkoutFromRoutine, cancelWorkout } = useWorkout();
  const { data: routines } = useRoutines();
  const [loading, setLoading] = useState(false);
  const [startingRoutineId, setStartingRoutineId] = useState<string | null>(null);

  const handleStartFree = async () => {
    if (activeWorkout) {
      router.push('/(app)/workout/active');
      return;
    }
    setLoading(true);
    try {
      await startWorkout();
      router.push('/(app)/workout/active');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoutine = async (routineId: string) => {
    if (activeWorkout) {
      Alert.alert(
        'Entrenamiento en curso',
        '¿Quieres continuar con el entrenamiento activo?',
        [
          { text: 'Continuar activo', onPress: () => router.push('/(app)/workout/active') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }
    setStartingRoutineId(routineId);
    try {
      await startWorkoutFromRoutine(routineId);
      router.push('/(app)/workout/active');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento.');
    } finally {
      setStartingRoutineId(null);
    }
  };

  const handleCancelActive = () => {
    Alert.alert(
      'Cancelar entrenamiento',
      '¿Seguro que quieres descartar el entrenamiento en curso?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => void cancelWorkout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-4 pb-2">
          <Text className="text-white text-2xl font-black">Entrenar</Text>
          <Text className="text-gray-500 text-sm mt-1">¿Qué toca hoy?</Text>
        </View>

        <View className="px-5">
          {/* Active workout banner */}
          {activeWorkout && (
            <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                <Text className="text-amber-400 font-bold">Entrenamiento en curso</Text>
              </View>
              <Text className="text-amber-500/70 text-sm mb-3">
                {activeWorkout.exercises.length} ejercicios añadidos
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 bg-amber-500 rounded-xl py-3 items-center"
                  onPress={() => router.push('/(app)/workout/active')}
                >
                  <Text className="text-black font-bold">Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-800 rounded-xl px-4 py-3 items-center"
                  onPress={handleCancelActive}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Free workout */}
          <TouchableOpacity
            className="bg-gray-900 rounded-2xl px-5 py-5 mb-5 flex-row items-center"
            onPress={() => void handleStartFree()}
            disabled={loading}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-amber-500/10 rounded-xl items-center justify-center mr-4">
              {loading ? (
                <ActivityIndicator color="#F59E0B" />
              ) : (
                <Ionicons name="flash" size={24} color="#F59E0B" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">Entrenamiento libre</Text>
              <Text className="text-gray-500 text-sm">Sin rutina preestablecida</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#4B5563" />
          </TouchableOpacity>

          {/* Routines section */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Mis rutinas
            </Text>
            <TouchableOpacity onPress={() => router.push('/routines' as Href)}>
              <Text className="text-amber-500 text-sm">Ver todas</Text>
            </TouchableOpacity>
          </View>

          {!routines || routines.length === 0 ? (
            <TouchableOpacity
              className="bg-gray-900 rounded-2xl px-5 py-6 items-center border border-dashed border-gray-700"
              onPress={() => router.push('/routines/create' as Href)}
            >
              <Ionicons name="add-circle-outline" size={32} color="#374151" />
              <Text className="text-gray-500 mt-2 font-semibold">Crear primera rutina</Text>
            </TouchableOpacity>
          ) : (
            routines.slice(0, 4).map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onPress={() => router.push(`/routines/${routine.id}` as Href)}
                onStart={() =>
                  startingRoutineId === routine.id
                    ? undefined
                    : void handleStartRoutine(routine.id)
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
