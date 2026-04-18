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
import { Link } from 'expo-router';
import { useAuthStore } from '../../features/auth/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Error al iniciar sesión', error);
    }
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
          {/* Logo */}
          <View className="items-center mb-12">
            <Text className="text-amber-500 text-5xl font-black tracking-tight">G</Text>
            <Text className="text-white text-3xl font-black tracking-tight">GainFile</Text>
            <Text className="text-gray-500 text-sm mt-2">Registra cada repetición. Supera cada marca.</Text>
          </View>

          {/* Form */}
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
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="text-gray-400 text-sm mb-1.5 font-medium">Contraseña</Text>
              <TextInput
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="••••••••"
                placeholderTextColor="#4B5563"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 ${loading ? 'bg-amber-500/50' : 'bg-amber-500'}`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-black font-bold text-base">Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">¿No tienes cuenta? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-amber-500 font-semibold">Regístrate</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
