import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Exercise } from '../types';
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';

interface Props {
  exercise: Exercise;
  onPress?: () => void;
  onLongPress?: () => void;
  rightAction?: React.ReactNode;
}

export function ExerciseCard({ exercise, onPress, onLongPress, rightAction }: Props) {
  const color = MUSCLE_GROUP_COLORS[exercise.muscleGroup] ?? '#6B7280';

  return (
    <TouchableOpacity
      className="flex-row items-center bg-gray-900 rounded-xl px-4 py-3 mb-2"
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View
        className="w-3 h-3 rounded-full mr-3"
        style={{ backgroundColor: color }}
      />
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{exercise.name}</Text>
        <Text className="text-gray-400 text-sm mt-0.5">
          {MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {EQUIPMENT_LABELS[exercise.equipment]}
        </Text>
      </View>
      {exercise.isCustom && (
        <View className="bg-amber-500/20 rounded-full px-2 py-0.5 mr-2">
          <Text className="text-amber-400 text-xs font-medium">Propio</Text>
        </View>
      )}
      {rightAction}
    </TouchableOpacity>
  );
}
