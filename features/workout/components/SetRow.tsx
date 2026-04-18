import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveSet } from '../store/workoutStore';

interface Props {
  set: ActiveSet;
  exerciseIndex: number;
  setIndex: number;
  onUpdate: (field: keyof Omit<ActiveSet, 'setNumber' | 'completed'>, value: string) => void;
  onToggleComplete: () => void;
  onRemove: () => void;
}

export function SetRow({ set, onUpdate, onToggleComplete, onRemove }: Props) {
  return (
    <View className="flex-row items-center py-2 px-1 gap-2">
      {/* Set number */}
      <Text className="text-gray-500 font-bold w-6 text-center text-sm">
        {set.setNumber}
      </Text>

      {/* Weight */}
      <View className="flex-1 bg-gray-800 rounded-lg px-2 py-1.5">
        <Text className="text-gray-500 text-xs mb-0.5">Kg</Text>
        <TextInput
          className="text-white text-sm font-semibold"
          value={set.weightKg}
          onChangeText={(v) => onUpdate('weightKg', v)}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor="#4B5563"
          returnKeyType="next"
        />
      </View>

      {/* Reps */}
      <View className="flex-1 bg-gray-800 rounded-lg px-2 py-1.5">
        <Text className="text-gray-500 text-xs mb-0.5">Reps</Text>
        <TextInput
          className="text-white text-sm font-semibold"
          value={set.reps}
          onChangeText={(v) => onUpdate('reps', v)}
          keyboardType="number-pad"
          placeholder="—"
          placeholderTextColor="#4B5563"
          returnKeyType="next"
        />
      </View>

      {/* RPE */}
      <View className="w-14 bg-gray-800 rounded-lg px-2 py-1.5">
        <Text className="text-gray-500 text-xs mb-0.5">RPE</Text>
        <TextInput
          className="text-white text-sm font-semibold"
          value={set.rpe}
          onChangeText={(v) => onUpdate('rpe', v)}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor="#4B5563"
          returnKeyType="done"
          maxLength={4}
        />
      </View>

      {/* Complete toggle */}
      <TouchableOpacity
        className={`w-9 h-9 rounded-full items-center justify-center ${
          set.completed ? 'bg-green-500' : 'bg-gray-700'
        }`}
        onPress={onToggleComplete}
      >
        <Ionicons
          name={set.completed ? 'checkmark' : 'checkmark-outline'}
          size={18}
          color={set.completed ? '#fff' : '#6B7280'}
        />
      </TouchableOpacity>

      {/* Remove */}
      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <Ionicons name="close" size={16} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
}
