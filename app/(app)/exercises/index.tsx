import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseCard } from '../../../features/exercises/components/ExerciseCard';
import { MuscleGroupFilter } from '../../../features/exercises/components/MuscleGroupFilter';
import { useExercises, useCreateExercise, useDeleteExercise } from '../../../features/exercises/hooks/useExercises';
import { MuscleGroup, Equipment } from '../../../types/database';
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS } from '../../../constants/exercises';
import { Exercise } from '../../../features/exercises/types';

const MUSCLE_GROUPS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];
const EQUIPMENT_LIST: Equipment[] = ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'other'];

export default function ExercisesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | undefined>(undefined);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>('chest');
  const [newEquipment, setNewEquipment] = useState<Equipment>('barbell');

  const { data: exercises, isLoading } = useExercises(muscleGroup);
  const createMutation = useCreateExercise();
  const deleteMutation = useDeleteExercise();

  const filtered = exercises?.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'El nombre del ejercicio es obligatorio.');
      return;
    }
    await createMutation.mutateAsync({
      name: newName.trim(),
      muscleGroup: newMuscle,
      equipment: newEquipment,
    });
    setShowCreate(false);
    setNewName('');
  };

  const handleLongPress = (exercise: Exercise) => {
    if (!exercise.isCustom) return;
    Alert.alert(
      exercise.name,
      '¿Qué quieres hacer?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void deleteMutation.mutateAsync(exercise.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View>
          <Text className="text-white text-2xl font-black">Ejercicios</Text>
          <Text className="text-gray-500 text-sm">{exercises?.length ?? 0} ejercicios</Text>
        </View>
        <TouchableOpacity
          className="bg-amber-500 rounded-full w-10 h-10 items-center justify-center"
          onPress={() => setShowCreate(true)}
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-gray-900 rounded-xl mx-5 mb-1 px-3 py-2">
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          className="flex-1 text-white ml-2"
          placeholder="Buscar ejercicio..."
          placeholderTextColor="#4B5563"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Muscle group filter */}
      <MuscleGroupFilter selected={muscleGroup} onSelect={setMuscleGroup} />

      {/* List */}
      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#F59E0B" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => router.push(`/(app)/exercises/${item.id}`)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Ionicons name="barbell-outline" size={48} color="#374151" />
              <Text className="text-gray-500 mt-3 text-center">
                {search ? 'Sin resultados para tu búsqueda' : 'No hay ejercicios'}
              </Text>
            </View>
          }
        />
      )}

      {/* Create exercise modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-gray-900 rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">Nuevo ejercicio</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-sm mb-1">Nombre</Text>
            <TextInput
              className="bg-gray-800 rounded-xl px-4 py-3 text-white mb-4"
              placeholder="Ej: Curl de concentración"
              placeholderTextColor="#4B5563"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            <Text className="text-gray-400 text-sm mb-2">Grupo muscular</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {MUSCLE_GROUPS.map((g) => (
                <TouchableOpacity
                  key={g}
                  className={`px-3 py-1.5 rounded-full border ${newMuscle === g ? 'bg-amber-500 border-amber-500' : 'border-gray-700'}`}
                  onPress={() => setNewMuscle(g)}
                >
                  <Text className={newMuscle === g ? 'text-black font-semibold text-sm' : 'text-gray-400 text-sm'}>
                    {MUSCLE_GROUP_LABELS[g]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-400 text-sm mb-2">Equipamiento</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {EQUIPMENT_LIST.map((eq) => (
                <TouchableOpacity
                  key={eq}
                  className={`px-3 py-1.5 rounded-full border ${newEquipment === eq ? 'bg-amber-500 border-amber-500' : 'border-gray-700'}`}
                  onPress={() => setNewEquipment(eq)}
                >
                  <Text className={newEquipment === eq ? 'text-black font-semibold text-sm' : 'text-gray-400 text-sm'}>
                    {EQUIPMENT_LABELS[eq]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${createMutation.isPending ? 'bg-amber-500/50' : 'bg-amber-500'}`}
              onPress={() => void handleCreate()}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-black text-base">Crear ejercicio</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
