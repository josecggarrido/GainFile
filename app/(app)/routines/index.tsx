import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRoutines } from '../../../features/routines/hooks/useRoutines';
import { RoutineCard } from '../../../features/routines/components/RoutineCard';
import { useWorkout } from '../../../features/workout/hooks/useWorkout';

export default function RoutinesScreen() {
  const router = useRouter();
  const { data: routines, isLoading, refetch } = useRoutines();
  const { startWorkoutFromRoutine, activeWorkout } = useWorkout();
  const [startingId, setStartingId] = useState<string | null>(null);

  const handleStart = async (routineId: string) => {
    if (activeWorkout) {
      Alert.alert(
        'Entrenamiento en curso',
        'Ya tienes un entrenamiento activo. ¿Quieres continuar con él?',
        [
          { text: 'Continuar actual', onPress: () => router.push('/(app)/workout/active') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    setStartingId(routineId);
    try {
      await startWorkoutFromRoutine(routineId);
      router.push('/(app)/workout/active');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento.');
    } finally {
      setStartingId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View>
          <Text className="text-white text-2xl font-black">Rutinas</Text>
          <Text className="text-gray-500 text-sm">
            {routines?.length ?? 0} rutinas guardadas
          </Text>
        </View>
        <TouchableOpacity
          className="bg-amber-500 rounded-full w-10 h-10 items-center justify-center"
          onPress={() => router.push('/routines/create' as Href)}
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F59E0B" />
        </View>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
          refreshing={false}
          onRefresh={() => void refetch()}
          renderItem={({ item }) => (
            <RoutineCard
              routine={item}
              onPress={() => router.push(`/routines/${item.id}` as Href)}
              onStart={() =>
                startingId === item.id ? undefined : void handleStart(item.id)
              }
            />
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Ionicons name="calendar-outline" size={56} color="#374151" />
              <Text className="text-gray-500 mt-4 text-center text-base">
                Todavía no tienes rutinas.{'\n'}Crea una para empezar.
              </Text>
              <TouchableOpacity
                className="mt-5 bg-amber-500 rounded-xl px-6 py-3"
                onPress={() => router.push('/routines/create' as Href)}
              >
                <Text className="text-black font-bold">Crear rutina</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
