import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDogDetailViewModel } from "./useDogDetailViewModel";

export default function DogDetailScreen() {
  const { name } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const dogName = Array.isArray(name) ? name[0] : name || "";

  const {
    dogInfo,
    isLoading,
    isFavorite,
    dogImageUrl,
    imageLoadingState,
    heartScale,
    toggleFavorite,
    handleImageError,
  } = useDogDetailViewModel(dogName);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].primary,
          },
          headerTitleStyle: {
            fontFamily: "InterTight-SemiBold",
          },
        }}
      />
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <ThemedView style={styles.container} useBackground={false}>
          <ThemedView style={styles.imageContainer} useBackground={false}>
            {imageLoadingState === "loading" ? (
              <ThemedView
                style={styles.imageLoadingContainer}
                useBackground={true}
              >
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
                onError={handleImageError}
              />
            ) : (
              <ThemedView style={styles.noImageContainer} useBackground={true}>
                <ThemedText
                  style={[
                    styles.noImageText,
                    { color: Colors[colorScheme ?? "light"].muted },
                  ]}
                >
                  Sorry! No image found for this dog breed.
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {isLoading ? (
            <ThemedView style={styles.loadingContainer} useBackground={false}>
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
              <ThemedView style={styles.titleContainer} useBackground={false}>
                <ThemedText type="title" style={styles.title}>
                  {dogName}
                </ThemedText>
                <TouchableOpacity
                  onPress={toggleFavorite}
                  style={styles.favoriteButtonInline}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <MaterialIcons
                      name={isFavorite ? "favorite" : "favorite-border"}
                      size={32}
                      color={
                        isFavorite
                          ? "#ff4081"
                          : Colors[colorScheme ?? "light"].icon
                      }
                    />
                  </Animated.View>
                </TouchableOpacity>
              </ThemedView>

              <ThemedText style={styles.description}>{dogInfo}</ThemedText>

              <TouchableOpacity
                style={[
                  styles.wikiButton,
                  { backgroundColor: Colors[colorScheme ?? "light"].tint },
                ]}
                onPress={() => {
                  // Open Wikipedia in the browser
                  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
                    dogName,
                  )}`;
                  WebBrowser.openBrowserAsync(wikipediaUrl);
                }}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.wikiButtonText}>
                  Read full article on Wikipedia
                </ThemedText>
                <MaterialIcons name="open-in-new" size={20} color="#fff" />
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textTransform: "capitalize",
    flex: 1,
  },
  favoriteButtonInline: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    gap: 10,
    shadowColor: Colors.light.tint,
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
    position: "relative",
  },

  noImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    padding: 20,
    color: "#888",
  },
});
