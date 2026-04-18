import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutHistory } from '../../../features/history/hooks/useHistory';
import { WorkoutCard } from '../../../features/history/components/WorkoutCard';

export default function HistoryScreen() {
  const router = useRouter();
  const { data: workouts, isLoading, error, refetch } = useWorkoutHistory();

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View>
          <Text className="text-white text-2xl font-black">Historial</Text>
          <Text className="text-gray-500 text-sm">
            {workouts?.length ?? 0} entrenamientos completados
          </Text>
        </View>
        <TouchableOpacity onPress={() => void refetch()} className="p-2">
          <Ionicons name="refresh" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F59E0B" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-400 text-center">
            Error al cargar el historial. Toca para reintentar.
          </Text>
          <TouchableOpacity
            className="mt-4 bg-amber-500 rounded-xl px-6 py-3"
            onPress={() => void refetch()}
          >
            <Text className="text-black font-bold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 }}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              onPress={() => router.push(`/(app)/history/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Ionicons name="time-outline" size={56} color="#374151" />
              <Text className="text-gray-500 mt-4 text-center text-base">
                Todavía no tienes entrenamientos.{'\n'}¡Empieza tu primera sesión!
              </Text>
              <TouchableOpacity
                className="mt-5 bg-amber-500 rounded-xl px-6 py-3"
                onPress={() => router.push('/(app)/workout')}
              >
                <Text className="text-black font-bold">Entrenar ahora</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
