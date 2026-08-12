import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFavoritesViewModel } from "./useFavoritesViewModel";

export default function FavoritesScreen() {
  const { favorites, isLoading, removeFavorite } = useFavoritesViewModel();
  const colorScheme = useColorScheme();

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
    router.push({
      pathname: "/detail",
      params: { name: dogName },
    });
  };

  if (isLoading) {
    return (
      <ThemedView
        style={[
          styles.emptyContainer,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        useBackground={true}
      >
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={styles.loadingText}>
          Loading your favorites...
        </ThemedText>
      </ThemedView>
    );
  }

  if (favorites.length === 0) {
    return (
      <ThemedView
        style={[
          styles.emptyContainer,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        useBackground={true}
      >
        <IconSymbol
          name="heart.slash"
          size={80}
          color={Colors[colorScheme ?? "light"].icon}
          style={styles.emptyIcon}
        />
        <ThemedText type="subtitle">No favorites yet</ThemedText>
        <ThemedText style={styles.noFavoritesText}>
          Add breeds to your favorites and they will appear here
        </ThemedText>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push("/(tabs)")}
        >
          <ThemedText style={styles.exploreButtonText}>
            Explore Dog Breeds
          </ThemedText>
          <IconSymbol name="pawprint.fill" size={16} color="#fff" />
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
      useBackground={true}
    >
      <ThemedView
        style={[
          styles.headerContainer,
          { borderBottomColor: Colors[colorScheme ?? "light"].border },
        ]}
        useBackground={false}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          My Favorite Dogs
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? "breed" : "breeds"} saved
        </ThemedText>
      </ThemedView>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => navigateToDetail(item.name)}
            activeOpacity={0.7}
          >
            <ThemedView
              style={[
                styles.favoriteCard,
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
              ]}
              useBackground={true}
            >
              {/* Card Image */}
              <ThemedView
                style={styles.cardImageContainer}
                useBackground={false}
              >
                {item.isLoading ? (
                  <ThemedView
                    style={styles.loadingImagePlaceholder}
                    useBackground={false}
                  >
                    <ActivityIndicator
                      size="small"
                      color={Colors[colorScheme ?? "light"].tint}
                    />
                  </ThemedView>
                ) : item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    contentFit="cover"
                    transition={300}
                  />
                ) : (
                  <ThemedView
                    style={[
                      styles.imagePlaceholder,
                      {
                        backgroundColor:
                          colorScheme === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.05)",
                      },
                    ]}
                    useBackground={false}
                  >
                    <IconSymbol
                      name="pawprint.fill"
                      size={40}
                      color={Colors[colorScheme ?? "light"].icon}
                      style={{ opacity: 0.5 }}
                    />
                  </ThemedView>
                )}

                {/* Remove button overlay */}
                <TouchableOpacity
                  onPress={() => confirmRemove(item.name)}
                  style={styles.removeButton}
                >
                  <ThemedView
                    style={styles.removeButtonCircle}
                    useBackground={true}
                  >
                    <IconSymbol name="xmark" size={16} color="#fff" />
                  </ThemedView>
                </TouchableOpacity>
              </ThemedView>

              {/* Card Content */}
              <ThemedView style={styles.cardContent} useBackground={false}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  {item.name}
                </ThemedText>

                {item.isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                ) : (
                  <ThemedText style={styles.cardDescription} numberOfLines={3}>
                    {item.description ||
                      "No description available for this breed."}
                  </ThemedText>
                )}

                <ThemedView style={styles.cardFooter} useBackground={false}>
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => navigateToDetail(item.name)}
                  >
                    <ThemedText
                      style={[
                        styles.readMoreText,
                        { color: Colors[colorScheme ?? "light"].tint },
                      ]}
                    >
                      Read More
                    </ThemedText>
                    <IconSymbol
                      name="chevron.right"
                      size={16}
                      color={Colors[colorScheme ?? "light"].tint}
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  noFavoritesText: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
    maxWidth: "80%",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    gap: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  headerContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 20,
  },
  favoriteItem: {
    marginBottom: 16,
  },
  favoriteCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.light.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImageContainer: {
    position: "relative",
    height: 180,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  loadingImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
    marginTop: 4,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tint,
    marginRight: 4,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  removeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
