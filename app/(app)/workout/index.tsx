import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkout } from '../../../features/workout/hooks/useWorkout';

export default function WorkoutScreen() {
  const router = useRouter();
  const { activeWorkout, startWorkout, cancelWorkout } = useWorkout();
  const [loading, setLoading] = useState(false);

  const handleStartFree = async () => {
    if (activeWorkout) {
      router.push('/(app)/workout/active');
      return;
    }
    setLoading(true);
    try {
      await startWorkout();
      router.push('/(app)/workout/active');
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento. Comprueba tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelActive = () => {
    Alert.alert(
      'Cancelar entrenamiento',
      '¿Seguro que quieres descartar el entrenamiento en curso? Se perderán los datos.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => void cancelWorkout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-white text-2xl font-black">Entrenar</Text>
        <Text className="text-gray-500 text-sm mt-1">Empieza una nueva sesión</Text>
      </View>

      <View className="flex-1 px-5 justify-center gap-4">
        {/* Active workout indicator */}
        {activeWorkout && (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-2">
            <View className="flex-row items-center mb-2">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              <Text className="text-amber-400 font-bold">Entrenamiento en curso</Text>
            </View>
            <Text className="text-amber-500/70 text-sm">
              {activeWorkout.exercises.length} ejercicios añadidos
            </Text>
            <View className="flex-row gap-2 mt-3">
              <TouchableOpacity
                className="flex-1 bg-amber-500 rounded-xl py-3 items-center"
                onPress={() => router.push('/(app)/workout/active')}
              >
                <Text className="text-black font-bold">Continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-800 rounded-xl px-4 py-3 items-center"
                onPress={handleCancelActive}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Start free workout */}
        <TouchableOpacity
          className={`rounded-2xl py-6 items-center ${activeWorkout ? 'bg-gray-900' : 'bg-amber-500'}`}
          onPress={handleStartFree}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={activeWorkout ? '#F59E0B' : '#000'} />
          ) : (
            <>
              <Ionicons
                name="barbell-outline"
                size={36}
                color={activeWorkout ? '#F59E0B' : '#000'}
              />
              <Text
                className={`font-black text-lg mt-2 ${activeWorkout ? 'text-amber-500' : 'text-black'}`}
              >
                {activeWorkout ? 'Nuevo entrenamiento' : 'Empezar entrenamiento libre'}
              </Text>
              <Text
                className={`text-sm mt-1 ${activeWorkout ? 'text-gray-500' : 'text-black/60'}`}
              >
                Sin rutina preestablecida
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Routines placeholder (Phase 2) */}
        <View className="bg-gray-900 rounded-2xl py-6 items-center opacity-40">
          <Ionicons name="calendar-outline" size={36} color="#6B7280" />
          <Text className="text-gray-400 font-bold text-lg mt-2">Desde rutina</Text>
          <Text className="text-gray-500 text-sm mt-1">Disponible en Fase 2</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
