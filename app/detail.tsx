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
  const [dogInfo, setDogInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const dogName = Array.isArray(name) ? name[0] : name || "";

  // Define all API-related functions with useCallback
  const getDogInfoFromApi = useCallback(() => {
    setIsLoading(true);

    axios
      .get(
        `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(
          dogName
        )}&origin=*`
      )
      .then((response) => {
        if (response.data && response.data.query && response.data.query.pages) {
          const responseData = response.data.query.pages;
          const values = Object.values(responseData) as { extract?: string }[];
          const extractValue = values[0]?.extract || "No info available.";
          setDogInfo(extractValue);
        } else {
          setDogInfo("No info available.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("getDogInfoFromApi() error is ", error);
        setDogInfo("Error loading information. Please try again.");
        setIsLoading(false);
      });
  }, [dogName]);

  const getWikipediaImage = useCallback(() => {
    setIsImageLoading(true);

    axios
      .get(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          dogName
        )}&prop=pageimages&format=json&pithumbsize=300&origin=*`
      )
      .then((response) => {
        if (response.data && response.data.query && response.data.query.pages) {
          const data = response.data.query.pages;
          const firstKey = Object.keys(data)[0];
          const imgUrl = data[firstKey]?.thumbnail?.source;
          if (imgUrl) {
            setImageUrl(imgUrl);
          }
        }
        setIsImageLoading(false);
      })
      .catch((error) => {
        console.log("getWikipediaImage() error is ", error);
        setIsImageLoading(false);
      });
  }, [dogName]);

  const checkIfFavorite = useCallback(async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(dogName));
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
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
    } catch (error) {
      console.error("Error updating favorites:", error);
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
            {isImageLoading ? (
              <ThemedView style={styles.imageLoadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </ThemedView>
            ) : (
              <Image
                source={{
                  uri:
                    imageUrl ||
                    `https://source.unsplash.com/300x200/?dog,${encodeURIComponent(
                      dogName
                    )}`,
                }}
                style={styles.dogImage}
                resizeMode="cover"
              />
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
              >
                <ThemedText style={styles.wikiButtonText}>
                  Read full article on Wikipedia
                </ThemedText>
                <IconSymbol name="arrow.up.right" size={18} color="#fff" />
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
    padding: 16,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  dogImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageLoadingContainer: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 12,
  },
  description: {
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 24,
  },
  wikiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8e4b8e",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    gap: 8,
  },
  wikiButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 10,
  },
});
