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
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../features/auth/store/authStore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Error al registrarse', error);
      return;
    }

    Alert.alert(
      '¡Registro exitoso!',
      'Revisa tu email para confirmar tu cuenta y luego inicia sesión.',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-10">
            <Text className="text-amber-500 text-5xl font-black">G</Text>
            <Text className="text-white text-3xl font-black">GainFile</Text>
            <Text className="text-gray-500 text-sm mt-2">Crea tu cuenta gratuita</Text>
          </View>

          <View className="gap-3">
            <View>
              <Text className="text-gray-400 text-sm mb-1.5 font-medium">Email</Text>
              <TextInput
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="tu@email.com"
                placeholderTextColor="#4B5563"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-gray-400 text-sm mb-1.5 font-medium">Contraseña</Text>
              <TextInput
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#4B5563"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View>
              <Text className="text-gray-400 text-sm mb-1.5 font-medium">Confirmar contraseña</Text>
              <TextInput
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="Repite tu contraseña"
                placeholderTextColor="#4B5563"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 ${loading ? 'bg-amber-500/50' : 'bg-amber-500'}`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-black font-bold text-base">Crear cuenta</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-amber-500 font-semibold">Inicia sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
