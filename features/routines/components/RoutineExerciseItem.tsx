import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutineExercise } from '../types';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';

interface Props {
  item: RoutineExercise;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function RoutineExerciseItem({
  item,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  const color = MUSCLE_GROUP_COLORS[item.exercise.muscleGroup] ?? '#6B7280';

  return (
    <View className="flex-row items-center bg-gray-900 rounded-xl px-3 py-3 mb-2">
      {/* Drag handle / index */}
      <Text className="text-gray-600 font-bold w-6 text-center text-sm mr-2">
        {index + 1}
      </Text>

      {/* Color dot */}
      <View className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: color }} />

      {/* Name */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm">{item.exercise.name}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">
          {MUSCLE_GROUP_LABELS[item.exercise.muscleGroup]}
        </Text>
      </View>

      {/* Reorder buttons */}
      <View className="flex-row items-center gap-1 mr-2">
        <TouchableOpacity
          className={`w-7 h-7 rounded-lg items-center justify-center ${index === 0 ? 'opacity-20' : 'bg-gray-800'}`}
          onPress={onMoveUp}
          disabled={index === 0}
        >
          <Ionicons name="chevron-up" size={14} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-7 h-7 rounded-lg items-center justify-center ${index === total - 1 ? 'opacity-20' : 'bg-gray-800'}`}
          onPress={onMoveDown}
          disabled={index === total - 1}
        >
          <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Remove */}
      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <Ionicons name="trash-outline" size={16} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
}
