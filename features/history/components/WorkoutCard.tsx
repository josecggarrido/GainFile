import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutListItem } from '../hooks/useHistory';

interface Props {
  workout: WorkoutListItem;
  onPress: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function WorkoutCard({ workout, onPress }: Props) {
  return (
    <TouchableOpacity
      className="bg-gray-900 rounded-2xl px-4 py-4 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-white font-bold text-base">
            {workout.routineName ?? 'Entrenamiento libre'}
          </Text>
          <Text className="text-gray-500 text-sm mt-0.5">
            {formatDate(workout.startedAt)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#4B5563" />
      </View>

      <View className="flex-row gap-4">
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#F59E0B" />
          <Text className="text-gray-400 text-sm ml-1">
            {formatDuration(workout.durationMinutes)}
          </Text>
        </View>
      </View>

      {workout.notes && (
        <Text className="text-gray-500 text-sm mt-2 italic" numberOfLines={1}>
          {workout.notes}
        </Text>
      )}
    </TouchableOpacity>
  );
}
