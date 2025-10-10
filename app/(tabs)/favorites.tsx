import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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

interface DogInfo {
  name: string;
  imageUrl: string | null;
  description: string;
  isLoading: boolean;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<DogInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  // Use useFocusEffect to refresh favorites when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      if (savedFavorites) {
        const favoriteNames = JSON.parse(savedFavorites) as string[];

        // Initialize with names only
        const initialFavorites = favoriteNames.map((name) => ({
          name,
          imageUrl: null,
          description: "",
          isLoading: true,
        }));

        setFavorites(initialFavorites);

        // Fetch details for each favorite
        favoriteNames.forEach((name, index) => {
          fetchDogInfo(name, index);
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setIsLoading(false);
    }
  };

  const fetchDogInfo = async (dogName: string, index: number) => {
    // Fetch image
    try {
      const imageApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        dogName
      )}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

      const imageResponse = await axios.get(imageApiUrl, {
        headers: { "User-Agent": "Doggopedia/1.0 (educational project)" },
      });

      let imageUrl = null;
      if (imageResponse.data?.query?.pages) {
        const pages = imageResponse.data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId && pages[pageId]?.thumbnail?.source) {
          const wikiImageUrl = pages[pageId].thumbnail.source;
          const matches = wikiImageUrl.match(/\/([^\/]+)\/([^\/]+)$/);
          if (matches && matches[1] && matches[2]) {
            const sizePrefixRemoved = matches[2].replace(/^\d+px-/, "");
            imageUrl = `https://wsrv.nl/?url=https://commons.wikimedia.org/wiki/Special:FilePath/${sizePrefixRemoved}&w=300&h=200&fit=cover&output=webp`;
          } else {
            imageUrl = wikiImageUrl;
          }
        }
      }

      // Fetch brief description
      const infoApiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${dogName}&origin=*`;
      const infoResponse = await axios.get(infoApiUrl, {
        headers: { "User-Agent": "Doggopedia/1.0 (educational project)" },
      });

      let description = "";
      if (infoResponse.data?.query?.pages) {
        const responseData = infoResponse.data.query.pages;
        const values = Object.values(responseData) as { extract?: string }[];
        description = values[0]?.extract || "";

        // Truncate description for card preview
        if (description.length > 120) {
          description = description.substring(0, 120) + "...";
        }
      }

      // Update state with the new information
      setFavorites((prevFavorites) => {
        const updatedFavorites = [...prevFavorites];
        updatedFavorites[index] = {
          ...updatedFavorites[index],
          imageUrl,
          description,
          isLoading: false,
        };
        return updatedFavorites;
      });
    } catch (error) {
      console.error(`Error fetching info for ${dogName}:`, error);
      // Mark as not loading even if there was an error
      setFavorites((prevFavorites) => {
        const updatedFavorites = [...prevFavorites];
        updatedFavorites[index] = {
          ...updatedFavorites[index],
          isLoading: false,
        };
        return updatedFavorites;
      });
    }
  };

  const removeFavorite = async (dogName: string) => {
    try {
      // Get current favorite names only
      const favoriteNames = favorites.map((dog) => dog.name);
      const updatedFavoriteNames = favoriteNames.filter(
        (name) => name !== dogName
      );

      // Update AsyncStorage
      await AsyncStorage.setItem(
        "dogFavorites",
        JSON.stringify(updatedFavoriteNames)
      );

      // Update state
      setFavorites((prevFavorites) =>
        prevFavorites.filter((dog) => dog.name !== dogName)
      );
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

  if (isLoading) {
    return (
      <ThemedView style={styles.emptyContainer} useBackground={true}>
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
      <ThemedView style={styles.emptyContainer} useBackground={true}>
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
      <ThemedView style={styles.headerContainer} useBackground={false}>
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
            <ThemedView style={styles.favoriteCard} useBackground={true}>
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
                    style={styles.imagePlaceholder}
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
                    <ThemedText style={styles.readMoreText}>
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
