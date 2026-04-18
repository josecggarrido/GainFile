import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useWorkoutHistory } from '../../features/history/hooks/useHistory';
import { WorkoutCard } from '../../features/history/components/WorkoutCard';
import { useWorkoutStore } from '../../features/workout/store/workoutStore';

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();
  const { data: history } = useWorkoutHistory();
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const router = useRouter();

  const recentWorkouts = history?.slice(0, 3) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-gray-500 text-sm">Bienvenido de vuelta</Text>
            <Text className="text-white text-xl font-bold">
              {user?.email?.split('@')[0] ?? 'Atleta'}
            </Text>
          </View>
          <TouchableOpacity onPress={signOut} className="p-2">
            <Ionicons name="log-out-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Active workout banner */}
        {activeWorkout && (
          <TouchableOpacity
            className="mx-5 mt-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 flex-row items-center"
            onPress={() => router.push('/(app)/workout/active')}
          >
            <View className="w-2 h-2 rounded-full bg-amber-500 mr-3" />
            <View className="flex-1">
              <Text className="text-amber-400 font-bold text-sm">Entrenamiento en curso</Text>
              <Text className="text-amber-500/70 text-xs">
                {activeWorkout.exercises.length} ejercicios · Toca para continuar
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#F59E0B" />
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <View className="px-5 mt-5">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Acciones rápidas
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-amber-500 rounded-2xl py-4 items-center"
              onPress={() => router.push('/(app)/workout')}
            >
              <Ionicons name="barbell" size={24} color="#000" />
              <Text className="text-black font-bold text-sm mt-1">Entrenar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-gray-900 rounded-2xl py-4 items-center"
              onPress={() => router.push('/(app)/exercises')}
            >
              <Ionicons name="list" size={24} color="#F59E0B" />
              <Text className="text-white font-bold text-sm mt-1">Ejercicios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-gray-900 rounded-2xl py-4 items-center"
              onPress={() => router.push('/(app)/history')}
            >
              <Ionicons name="time" size={24} color="#F59E0B" />
              <Text className="text-white font-bold text-sm mt-1">Historial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent workouts */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Entrenamientos recientes
            </Text>
            {(history?.length ?? 0) > 3 && (
              <TouchableOpacity onPress={() => router.push('/(app)/history')}>
                <Text className="text-amber-500 text-sm">Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentWorkouts.length === 0 ? (
            <View className="bg-gray-900 rounded-2xl px-4 py-8 items-center">
              <Ionicons name="barbell-outline" size={40} color="#374151" />
              <Text className="text-gray-600 mt-3 text-center">
                Aún no has registrado entrenamientos.{'\n'}¡Empieza tu primer sesión!
              </Text>
            </View>
          ) : (
            recentWorkouts.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                onPress={() => router.push(`/(app)/history/${w.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
