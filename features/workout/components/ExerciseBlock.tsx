import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveExercise, ActiveSet } from '../store/workoutStore';
import { SetRow } from './SetRow';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';

interface Props {
  entry: ActiveExercise;
  exerciseIndex: number;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onUpdateSet: (
    setIndex: number,
    field: keyof Omit<ActiveSet, 'setNumber' | 'completed'>,
    value: string
  ) => void;
  onToggleSetComplete: (setIndex: number) => void;
  onRemoveExercise: () => void;
}

export function ExerciseBlock({
  entry,
  exerciseIndex,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onToggleSetComplete,
  onRemoveExercise,
}: Props) {
  const { exercise, sets } = entry;
  const color = MUSCLE_GROUP_COLORS[exercise.muscleGroup] ?? '#6B7280';
  const completedCount = sets.filter((s) => s.completed).length;

  const handleRemove = () => {
    Alert.alert(
      'Eliminar ejercicio',
      `¿Quitar "${exercise.name}" del entrenamiento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onRemoveExercise },
      ]
    );
  };

  return (
    <View className="bg-gray-900 rounded-2xl mb-3 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-3 pb-2">
        <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: color }} />
        <View className="flex-1">
          <Text className="text-white font-bold text-base">{exercise.name}</Text>
          <Text className="text-gray-500 text-xs">
            {MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {completedCount}/{sets.length} series
          </Text>
        </View>
        <TouchableOpacity onPress={handleRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Column headers */}
      <View className="flex-row px-3 pb-1">
        <Text className="text-gray-600 text-xs w-8 text-center">#</Text>
        <Text className="text-gray-600 text-xs flex-1 ml-2">Kg</Text>
        <Text className="text-gray-600 text-xs flex-1">Reps</Text>
        <Text className="text-gray-600 text-xs w-14">RPE</Text>
        <View className="w-9" />
        <View className="w-6" />
      </View>

      {/* Sets */}
      <View className="px-3">
        {sets.map((s, setIndex) => (
          <SetRow
            key={setIndex}
            set={s}
            exerciseIndex={exerciseIndex}
            setIndex={setIndex}
            onUpdate={(field, value) => onUpdateSet(setIndex, field, value)}
            onToggleComplete={() => onToggleSetComplete(setIndex)}
            onRemove={() => onRemoveSet(setIndex)}
          />
        ))}
      </View>

      {/* Add set */}
      <TouchableOpacity
        className="flex-row items-center justify-center py-3 border-t border-gray-800 mt-1"
        onPress={onAddSet}
      >
        <Ionicons name="add" size={16} color="#F59E0B" />
        <Text className="text-amber-500 font-semibold text-sm ml-1">Añadir serie</Text>
      </TouchableOpacity>
    </View>
  );
}
