import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutineWithCount } from '../types';

interface Props {
  routine: RoutineWithCount;
  onPress: () => void;
  onStart: () => void;
}

export function RoutineCard({ routine, onPress, onStart }: Props) {
  return (
    <TouchableOpacity
      className="bg-gray-900 rounded-2xl px-4 py-4 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-white font-bold text-base" numberOfLines={1}>
            {routine.name}
          </Text>
          {routine.description ? (
            <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
              {routine.description}
            </Text>
          ) : null}
          <View className="flex-row items-center mt-2">
            <Ionicons name="barbell-outline" size={13} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1">
              {routine.exerciseCount}{' '}
              {routine.exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-amber-500 rounded-full w-11 h-11 items-center justify-center ml-3"
          onPress={onStart}
          hitSlop={8}
        >
          <Ionicons name="play" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
