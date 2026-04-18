import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useRoutineDetail,
  useUpdateRoutine,
  useDeleteRoutine,
  useAddExerciseToRoutine,
  useRemoveExerciseFromRoutine,
  useReorderRoutineExercises,
} from '../../../features/routines/hooks/useRoutines';
import { RoutineExerciseItem } from '../../../features/routines/components/RoutineExerciseItem';
import { AddExerciseModal } from '../../../features/workout/components/AddExerciseModal';
import { Exercise } from '../../../features/exercises/types';
import { useWorkout } from '../../../features/workout/hooks/useWorkout';
import { RoutineExercise } from '../../../features/routines/types';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: routine, isLoading, error } = useRoutineDetail(id);
  const updateMutation = useUpdateRoutine();
  const deleteMutation = useDeleteRoutine();
  const addExerciseMutation = useAddExerciseToRoutine(id);
  const removeExerciseMutation = useRemoveExerciseFromRoutine(id);
  const reorderMutation = useReorderRoutineExercises(id);
  const { startWorkoutFromRoutine, activeWorkout } = useWorkout();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [starting, setStarting] = useState(false);

  const handleOpenEdit = () => {
    if (!routine) return;
    setEditName(routine.name);
    setEditDesc(routine.description ?? '');
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await updateMutation.mutateAsync({
      id,
      name: editName.trim(),
      description: editDesc.trim() || null,
    });
    setShowEdit(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar rutina',
      `¿Seguro que quieres eliminar "${routine?.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(id);
            router.replace('/routines' as Href);
          },
        },
      ]
    );
  };

  const handleAddExercise = async (exercise: Exercise) => {
    await addExerciseMutation.mutateAsync(exercise.id);
  };

  const handleRemoveExercise = (routineExercise: RoutineExercise) => {
    Alert.alert(
      'Eliminar ejercicio',
      `¿Quitar "${routineExercise.exercise.name}" de la rutina?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void removeExerciseMutation.mutateAsync(routineExercise.id),
        },
      ]
    );
  };

  const handleMove = (exercises: RoutineExercise[], fromIndex: number, toIndex: number) => {
    const reordered = [...exercises];
    const removed = reordered.splice(fromIndex, 1);
    const moved = removed[0];
    if (!moved) return;
    reordered.splice(toIndex, 0, moved);
    const updates = reordered.map((re, i) => ({ id: re.id, orderIndex: i }));
    void reorderMutation.mutateAsync(updates);
  };

  const handleStart = async () => {
    if (activeWorkout) {
      Alert.alert(
        'Entrenamiento en curso',
        '¿Continuar con el entrenamiento actual?',
        [
          { text: 'Continuar', onPress: () => router.push('/(app)/workout/active') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }
    setStarting(true);
    try {
      await startWorkoutFromRoutine(id);
      router.push('/(app)/workout/active');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento.');
    } finally {
      setStarting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#F59E0B" />
      </View>
    );
  }

  if (error || !routine) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center px-6">
        <Text className="text-gray-400 text-center">No se pudo cargar la rutina.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-amber-500">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white font-black text-lg" numberOfLines={1}>
            {routine.name}
          </Text>
          {routine.description ? (
            <Text className="text-gray-500 text-xs" numberOfLines={1}>
              {routine.description}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleOpenEdit} className="mr-2 p-1">
          <Ionicons name="pencil-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} className="p-1">
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise count */}
        <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Ejercicios ({routine.exercises.length})
        </Text>

        {routine.exercises.length === 0 ? (
          <View className="items-center py-12 bg-gray-900 rounded-2xl">
            <Ionicons name="barbell-outline" size={40} color="#374151" />
            <Text className="text-gray-500 mt-3 text-center">
              No hay ejercicios todavía.{'\n'}Toca el botón para añadir.
            </Text>
          </View>
        ) : (
          routine.exercises.map((re, index) => (
            <RoutineExerciseItem
              key={re.id}
              item={re}
              index={index}
              total={routine.exercises.length}
              onMoveUp={() => handleMove(routine.exercises, index, index - 1)}
              onMoveDown={() => handleMove(routine.exercises, index, index + 1)}
              onRemove={() => handleRemoveExercise(re)}
            />
          ))
        )}

        {/* Add exercise button */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-gray-900 rounded-xl py-3.5 mt-2 border border-dashed border-gray-700"
          onPress={() => setShowAddExercise(true)}
        >
          <Ionicons name="add" size={18} color="#F59E0B" />
          <Text className="text-amber-500 font-semibold ml-1">Añadir ejercicio</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Start workout button */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-5 py-4">
        <SafeAreaView edges={['bottom']}>
          <TouchableOpacity
            className={`rounded-xl py-4 items-center flex-row justify-center gap-2 ${
              starting || routine.exercises.length === 0
                ? 'bg-amber-500/40'
                : 'bg-amber-500'
            }`}
            onPress={() => void handleStart()}
            disabled={starting || routine.exercises.length === 0}
          >
            {starting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="play" size={18} color="#000" />
                <Text className="text-black font-black text-base">
                  Empezar entrenamiento
                </Text>
              </>
            )}
          </TouchableOpacity>
          {routine.exercises.length === 0 && (
            <Text className="text-gray-600 text-xs text-center mt-2">
              Añade al menos un ejercicio para empezar
            </Text>
          )}
        </SafeAreaView>
      </View>

      {/* Add exercise modal */}
      <AddExerciseModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onSelect={(exercise) => {
          setShowAddExercise(false);
          void handleAddExercise(exercise);
        }}
      />

      {/* Edit modal */}
      <Modal visible={showEdit} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-gray-900 rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">Editar rutina</Text>
              <TouchableOpacity onPress={() => setShowEdit(false)}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-sm mb-1">Nombre</Text>
            <TextInput
              className="bg-gray-800 rounded-xl px-4 py-3 text-white mb-3"
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre de la rutina"
              placeholderTextColor="#4B5563"
              autoFocus
            />

            <Text className="text-gray-400 text-sm mb-1">Descripción</Text>
            <TextInput
              className="bg-gray-800 rounded-xl px-4 py-3 text-white mb-4"
              value={editDesc}
              onChangeText={setEditDesc}
              placeholder="Descripción (opcional)"
              placeholderTextColor="#4B5563"
              multiline
            />

            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${updateMutation.isPending ? 'bg-amber-500/50' : 'bg-amber-500'}`}
              onPress={() => void handleSaveEdit()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-black text-base">Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
