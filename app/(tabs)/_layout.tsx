import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].primary,
        },
        headerTitleStyle: {
          fontFamily: "InterTight-SemiBold",
        },
        headerTitle: "Doggopedia",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Breeds",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="pawprint.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
