import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkout } from '../../../features/workout/hooks/useWorkout';
import { ExerciseBlock } from '../../../features/workout/components/ExerciseBlock';
import { AddExerciseModal } from '../../../features/workout/components/AddExerciseModal';
import { Exercise } from '../../../features/exercises/types';
import { ActiveSet } from '../../../features/workout/store/workoutStore';

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const {
    activeWorkout,
    finishWorkout,
    cancelWorkout,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    toggleSetComplete,
  } = useWorkout();

  const [elapsed, setElapsed] = useState(0);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!activeWorkout) return;
    const startMs = new Date(activeWorkout.startedAt).getTime();
    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startMs) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [activeWorkout]);

  // Redirect if no active workout
  useEffect(() => {
    if (!activeWorkout) {
      router.replace('/(app)/workout');
    }
  }, [activeWorkout]);

  const totalCompleted =
    activeWorkout?.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    ) ?? 0;

  const handleAddExercise = useCallback(
    (exercise: Exercise) => {
      addExercise(exercise);
    },
    [addExercise]
  );

  const handleFinish = () => {
    if (totalCompleted === 0) {
      Alert.alert(
        'Sin series completadas',
        '¿Finalizar el entrenamiento sin series marcadas como completadas?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar igualmente', onPress: () => setNotesVisible(true) },
        ]
      );
      return;
    }
    setNotesVisible(true);
  };

  const confirmFinish = async () => {
    setNotesVisible(false);
    setFinishing(true);
    try {
      await finishWorkout(notes.trim() || undefined);
      router.replace('/(app)/history');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el entrenamiento. Inténtalo de nuevo.');
    } finally {
      setFinishing(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar entrenamiento',
      'Se descartarán todos los datos. ¿Continuar?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: async () => {
            await cancelWorkout();
            router.replace('/(app)/workout');
          },
        },
      ]
    );
  };

  if (!activeWorkout) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white font-black text-base">ENTRENAMIENTO</Text>
          <Text className="text-amber-500 font-mono font-bold text-lg">
            {formatElapsed(elapsed)}
          </Text>
        </View>

        <View className="flex-row items-center bg-green-500/10 rounded-full px-3 py-1">
          <Text className="text-green-400 font-bold text-sm">{totalCompleted}</Text>
          <Text className="text-green-400/60 text-xs ml-1">series</Text>
        </View>
      </View>

      {/* Exercise list */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeWorkout.exercises.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="barbell-outline" size={56} color="#374151" />
            <Text className="text-gray-600 mt-4 text-center text-base">
              No hay ejercicios todavía.{'\n'}Toca el botón para añadir.
            </Text>
          </View>
        ) : (
          activeWorkout.exercises.map((entry, exerciseIndex) => (
            <ExerciseBlock
              key={`${entry.exercise.id}-${exerciseIndex}`}
              entry={entry}
              exerciseIndex={exerciseIndex}
              onAddSet={() => addSet(exerciseIndex)}
              onRemoveSet={(setIndex) => removeSet(exerciseIndex, setIndex)}
              onUpdateSet={(setIndex, field, value) =>
                updateSet(exerciseIndex, setIndex, field as keyof Omit<ActiveSet, 'setNumber' | 'completed'>, value)
              }
              onToggleSetComplete={(setIndex) => toggleSetComplete(exerciseIndex, setIndex)}
              onRemoveExercise={() => removeExercise(exerciseIndex)}
            />
          ))
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 py-4 gap-3">
        <SafeAreaView edges={['bottom']}>
          <TouchableOpacity
            className="bg-gray-800 rounded-xl py-3 items-center flex-row justify-center mb-2"
            onPress={() => setShowAddExercise(true)}
          >
            <Ionicons name="add" size={20} color="#F59E0B" />
            <Text className="text-amber-500 font-bold ml-1">Añadir ejercicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${finishing ? 'bg-green-500/50' : 'bg-green-500'}`}
            onPress={handleFinish}
            disabled={finishing}
          >
            {finishing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-black text-base">
                Finalizar entrenamiento
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Add exercise modal */}
      <AddExerciseModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onSelect={handleAddExercise}
      />

      {/* Notes modal */}
      <Modal visible={notesVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-gray-900 rounded-t-3xl px-5 pt-5 pb-10">
            <Text className="text-white font-bold text-lg mb-3">Notas del entrenamiento</Text>
            <TextInput
              className="bg-gray-800 rounded-xl px-4 py-3 text-white text-base"
              placeholder="¿Cómo te fue hoy? (opcional)"
              placeholderTextColor="#4B5563"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoFocus
            />
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-800 rounded-xl py-3 items-center"
                onPress={() => setNotesVisible(false)}
              >
                <Text className="text-gray-400 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-2 bg-green-500 rounded-xl py-3 px-6 items-center"
                onPress={() => void confirmFinish()}
              >
                <Text className="text-white font-black">Guardar y finalizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
