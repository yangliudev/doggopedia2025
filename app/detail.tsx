import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function DogDetailScreen() {
  const { name } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const dogName = Array.isArray(name) ? name[0] : name || "";

  // State variables
  const [dogInfo, setDogInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [dogImageUrl, setDogImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  // Define all API-related functions with useCallback
  const getDogInfoFromApi = useCallback(() => {
    setIsLoading(true);
    const apiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${dogName}&origin=*`;

    axios
      .get(apiUrl, {
        headers: {
          "User-Agent": "Doggopedia/1.0 (educational project)",
        },
      })
      .then((response) => {
        if (response.data?.query?.pages) {
          const responseData = response.data.query.pages;
          const values = Object.values(responseData) as { extract?: string }[];
          const extractValue =
            values[0]?.extract ||
            "No information available for this dog breed.";
          setDogInfo(extractValue);
        } else {
          setDogInfo("No information available for this dog breed.");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setDogInfo(
          "Unable to load information. Please check your connection and try again."
        );
        setIsLoading(false);
      });
  }, [dogName]);

  const getWikipediaImage = useCallback(() => {
    setImageLoadingState("loading");
    const imageApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      dogName
    )}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

    axios
      .get(imageApiUrl, {
        headers: {
          "User-Agent": "Doggopedia/1.0 (educational project)",
        },
      })
      .then((response) => {
        if (response.data?.query?.pages) {
          const pages = response.data.query.pages;
          const pageId = Object.keys(pages)[0];

          if (pageId && pages[pageId]?.thumbnail?.source) {
            // Get Wikipedia image URL
            const wikiImageUrl = pages[pageId].thumbnail.source;

            try {
              // Extract the image filename from URL
              const matches = wikiImageUrl.match(/\/([^\/]+)\/([^\/]+)$/);
              if (matches && matches[1] && matches[2]) {
                // Remove size prefix from filename
                const sizePrefixRemoved = matches[2].replace(/^\d+px-/, "");
                // Use image proxy service for better React Native compatibility
                const proxyUrl = `https://wsrv.nl/?url=https://commons.wikimedia.org/wiki/Special:FilePath/${sizePrefixRemoved}&w=500&h=400&fit=cover&output=webp`;
                setDogImageUrl(proxyUrl);
              } else {
                setDogImageUrl(wikiImageUrl);
              }
            } catch (err) {
              setDogImageUrl(wikiImageUrl); // Fallback to original URL
            }

            setImageLoadingState("loaded");
          } else {
            setDogImageUrl(null);
            setImageLoadingState("error");
          }
        } else {
          setDogImageUrl(null);
          setImageLoadingState("error");
        }
      })
      .catch((error) => {
        setDogImageUrl(null);
        setImageLoadingState("error");
      });
  }, [dogName]);

  const checkIfFavorite = useCallback(async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(dogName));
      }
    } catch {
      // Silent error - non-critical functionality
    }
  }, [dogName]);

  const toggleFavorite = useCallback(async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      let favorites: string[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      if (isFavorite) {
        favorites = favorites.filter((name) => name !== dogName);
      } else {
        favorites.push(dogName);
      }

      await AsyncStorage.setItem("dogFavorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch {
      // Silent error - non-critical functionality
    }
  }, [dogName, isFavorite]);

  // Add the useEffect after all the function definitions
  useEffect(() => {
    checkIfFavorite();
    getDogInfoFromApi();
    getWikipediaImage();
  }, [checkIfFavorite, getDogInfoFromApi, getWikipediaImage]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: dogName,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].primary,
          },
          headerTitleStyle: {
            fontFamily: "InterTight-SemiBold",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleFavorite}
              style={styles.favoriteButton}
            >
              <IconSymbol
                name={isFavorite ? "heart.fill" : "heart"}
                size={24}
                color={
                  isFavorite ? "#ff4081" : Colors[colorScheme ?? "light"].icon
                }
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.imageContainer}>
            {imageLoadingState === "loading" ? (
              <ThemedView style={styles.imageLoadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </ThemedView>
            ) : dogImageUrl && imageLoadingState === "loaded" ? (
              <Image
                source={{ uri: dogImageUrl }}
                style={styles.dogImage}
                resizeMode="cover"
                onError={() => setImageLoadingState("error")}
              />
            ) : (
              <ThemedView style={styles.noImageContainer}>
                <ThemedText style={styles.noImageText}>
                  Sorry! No image found for this dog breed.
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {isLoading ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={Colors[colorScheme ?? "light"].tint}
              />
              <ThemedText style={styles.loadingText}>
                Fetching information about {dogName}...
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              <ThemedText type="title" style={styles.title}>
                {dogName}
              </ThemedText>

              <ThemedText style={styles.description}>{dogInfo}</ThemedText>

              <TouchableOpacity
                style={styles.wikiButton}
                onPress={() => {
                  alert(`Opening full Wikipedia page for ${dogName}`);
                }}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.wikiButtonText}>
                  Read full article on Wikipedia
                </ThemedText>
                <IconSymbol name="arrow.up.right" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dogImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    marginTop: 8,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 200,
  },
  imageLoadingContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  description: {
    lineHeight: 26,
    fontSize: 16,
    marginBottom: 30,
    letterSpacing: 0.3,
  },
  wikiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8e4b8e",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    gap: 10,
    shadowColor: "#8e4b8e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  wikiButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  favoriteButton: {
    padding: 12,
    marginRight: 6,
  },
  noImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  noImageText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    padding: 20,
    color: "#888",
  },
});
