import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function TabLayout() {
  const tabConfig: Array<{
    name: 'seniors' | 'legends' | 'WPL' | 'pitchpal' | 'compare';
    title: string;
    icon: IconName;
    color: string;
  }> = [
    { name: 'seniors',  title: 'Senior',   icon: 'crown'   as IconName, color: '#FF6B35' },
    { name: 'legends',  title: 'Legends',  icon: 'star'    as IconName, color: '#F7B801' },
    { name: 'pitchpal', title: 'PitchPal', icon: 'cricket' as IconName, color: '#C2185B' },
    { name: 'WPL',      title: 'WPL',      icon: 'trophy'  as IconName, color: '#00D9FF' },
    { name: 'compare',  title: 'Compare',  icon: 'swap-horizontal' as IconName, color: '#9C27B0' },
  ];

  return (
    <Tabs screenOptions={({ route }) => {
      const tab = tabConfig.find((t) => t.name === route.name as any);
      return {
        headerShown: false,
        tabBarActiveTintColor: tab?.color || '#FF6B35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E8E8',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 4 },
        tabBarIcon: ({ color: iconColor, focused }) => (
          <MaterialCommunityIcons
            name={(tab?.icon || 'circle') as IconName}
            size={24}
            color={focused ? tab?.color : iconColor}
          />
        ),
        tabBarLabel: tab?.title || route.name,
      };
    }}>
      <Tabs.Screen name="seniors"  options={{ title: 'Senior'   }} />
      <Tabs.Screen name="legends"  options={{ title: 'Legends'  }} />
      <Tabs.Screen name="pitchpal" options={{ title: 'PitchPal' }} />
      <Tabs.Screen name="WPL"      options={{ title: 'WPL'      }} />
      <Tabs.Screen name="compare"  options={{ title: 'Compare'  }} />
    </Tabs>
  );
}