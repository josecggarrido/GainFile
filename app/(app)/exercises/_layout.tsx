import React from 'react';
import { Stack } from 'expo-router';

export default function ExercisesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F0F0F' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
