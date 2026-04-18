import React from 'react';
import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F0F0F' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="active"
        options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
      />
    </Stack>
  );
}
