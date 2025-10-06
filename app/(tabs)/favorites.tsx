import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const removeFavorite = async (dogName: string) => {
    try {
      const updatedFavorites = favorites.filter((name) => name !== dogName);
      await AsyncStorage.setItem(
        "dogFavorites",
        JSON.stringify(updatedFavorites)
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const confirmRemove = (dogName: string) => {
    Alert.alert("Remove Favorite", `Remove ${dogName} from your favorites?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => removeFavorite(dogName),
        style: "destructive",
      },
    ]);
  };

  const navigateToDetail = (dogName: string) => {
    // Navigate to the detail page with the dog name as a parameter
    router.push({
      pathname: "/detail",
      params: { name: dogName },
    });
  };

  if (favorites.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <IconSymbol
          name="heart.slash"
          size={80}
          color={Colors[colorScheme ?? "light"].icon}
          style={styles.emptyIcon}
        />
        <ThemedText type="subtitle">No favorites yet</ThemedText>
        <ThemedText>Your favorite dog breeds will appear here</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => navigateToDetail(item)}
          >
            <ThemedView style={styles.favoriteCard}>
              <ThemedText type="subtitle">{item}</ThemedText>
              <TouchableOpacity
                onPress={() => confirmRemove(item)}
                style={styles.removeButton}
              >
                <IconSymbol
                  name="xmark.circle.fill"
                  size={24}
                  color="#ff6b6b"
                />
              </TouchableOpacity>
            </ThemedView>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  favoriteItem: {
    marginBottom: 12,
  },
  favoriteCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffe4ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    padding: 4,
  },
});
