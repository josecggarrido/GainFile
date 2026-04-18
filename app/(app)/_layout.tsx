import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  focused,
}: {
  name: IconName;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IconName)}
      size={24}
      color={focused ? '#F59E0B' : '#6B7280'}
    />
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#1F2937',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Entrenar',
          tabBarIcon: ({ focused }) => <TabIcon name="barbell" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ focused }) => <TabIcon name="list" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ focused }) => <TabIcon name="time" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
