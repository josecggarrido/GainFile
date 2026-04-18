import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../exercises/types';
import { ExerciseCard } from '../../exercises/components/ExerciseCard';
import { MuscleGroupFilter } from '../../exercises/components/MuscleGroupFilter';
import { useExercises } from '../../exercises/hooks/useExercises';
import { MuscleGroup } from '../../../types/database';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export function AddExerciseModal({ visible, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | undefined>(undefined);
  const { data: exercises, isLoading } = useExercises(muscleGroup);

  const filtered = exercises?.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
    setSearch('');
    setMuscleGroup(undefined);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-gray-950">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
          <Text className="text-white text-lg font-bold flex-1">Añadir ejercicio</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-800 rounded-xl mx-4 mt-3 px-3 py-2">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            className="flex-1 text-white ml-2"
            placeholder="Buscar ejercicio..."
            placeholderTextColor="#4B5563"
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter */}
        <MuscleGroupFilter selected={muscleGroup} onSelect={setMuscleGroup} />

        {/* List */}
        {isLoading ? (
          <ActivityIndicator className="mt-8" color="#F59E0B" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <ExerciseCard
                exercise={item}
                onPress={() => handleSelect(item)}
                rightAction={
                  <Ionicons name="add-circle-outline" size={22} color="#F59E0B" />
                }
              />
            )}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-8">
                No se encontraron ejercicios
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
