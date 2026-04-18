import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { MuscleGroup } from '../../../types/database';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../../../constants/exercises';

const ALL_GROUPS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];

interface Props {
  selected: MuscleGroup | undefined;
  onSelect: (group: MuscleGroup | undefined) => void;
}

export function MuscleGroupFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-grow-0"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
    >
      <TouchableOpacity
        className={`px-4 py-2 rounded-full border ${
          !selected
            ? 'bg-amber-500 border-amber-500'
            : 'bg-transparent border-gray-700'
        }`}
        onPress={() => onSelect(undefined)}
      >
        <Text className={!selected ? 'text-black font-semibold' : 'text-gray-400'}>
          Todos
        </Text>
      </TouchableOpacity>

      {ALL_GROUPS.map((group) => {
        const isActive = selected === group;
        const color = MUSCLE_GROUP_COLORS[group] ?? '#6B7280';
        return (
          <TouchableOpacity
            key={group}
            className={`px-4 py-2 rounded-full border ${
              isActive ? 'border-transparent' : 'bg-transparent border-gray-700'
            }`}
            style={isActive ? { backgroundColor: color } : undefined}
            onPress={() => onSelect(isActive ? undefined : group)}
          >
            <Text className={isActive ? 'text-white font-semibold' : 'text-gray-400'}>
              {MUSCLE_GROUP_LABELS[group]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
