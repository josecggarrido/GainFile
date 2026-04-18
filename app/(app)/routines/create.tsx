import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateRoutine } from '../../../features/routines/hooks/useRoutines';

export default function CreateRoutineScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreateRoutine();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre de la rutina es obligatorio.');
      return;
    }

    const routine = await createMutation.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    router.replace(`/routines/${routine.id}` as Href);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg flex-1">Nueva rutina</Text>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-4">
            <Text className="text-gray-400 text-sm font-medium mb-1.5">
              Nombre <Text className="text-red-400">*</Text>
            </Text>
            <TextInput
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholder="Ej: Push Day, Torso, Pierna..."
              placeholderTextColor="#4B5563"
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={60}
              returnKeyType="next"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 text-sm font-medium mb-1.5">
              Descripción <Text className="text-gray-600">(opcional)</Text>
            </Text>
            <TextInput
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholder="Notas sobre esta rutina..."
              placeholderTextColor="#4B5563"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
          </View>

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${createMutation.isPending ? 'bg-amber-500/50' : 'bg-amber-500'}`}
            onPress={() => void handleCreate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black font-black text-base">
                Crear y añadir ejercicios →
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
