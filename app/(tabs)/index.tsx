import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  // Use async import to load JSON data
  useEffect(() => {
    const loadDogBreedsData = async () => {
      try {
        // Modern dynamic import for JSON data
        const wikiJsonObj = await import("@/api/cleanedData.json");
        const wikiJsonString = wikiJsonObj.default[0]?.dogBreeds;

        if (wikiJsonString) {
          const jsonDataArray = wikiJsonString.split(", ");
          const cleanedBreeds = jsonDataArray
            .filter((breed) => breed && breed.trim()) // Filter out empty strings
            .map((breed) => breed.trim()); // Clean up whitespace

          setDogBreeds(cleanedBreeds);
          setFilteredBreeds(cleanedBreeds);
        }
      } catch (error) {
        console.error("Error loading dog breeds data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDogBreedsData();
  }, []);

  // Search functionality using memoization for better performance
  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (!text) {
        setFilteredBreeds(dogBreeds);
        return;
      }

      const searchTerm = text.toLowerCase();
      const filtered = dogBreeds.filter((breed) =>
        breed.toLowerCase().includes(searchTerm)
      );
      setFilteredBreeds(filtered);
    },
    [dogBreeds]
  );

  const navigateToDogDetail = (dogName: string) => {
    // Navigate to the detail page with the dog name as a parameter
    router.push({
      pathname: "/detail",
      params: { name: dogName },
    });
  };
  const renderSectionHeader = (letter: string) => (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText type="subtitle" style={styles.sectionHeaderText}>
        {letter}
      </ThemedText>
    </ThemedView>
  );

  const renderAlphabeticalList = () => {
    // Group dogs by first letter
    const groupedDogs = filteredBreeds.reduce((acc, dog) => {
      const firstLetter = dog.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(dog);
      return acc;
    }, {} as Record<string, string[]>);

    // Get sorted letters
    const letters = Object.keys(groupedDogs).sort();

    return (
      <FlatList
        data={letters}
        keyExtractor={(item) => item}
        renderItem={({ item: letter }) => (
          <>
            {renderSectionHeader(letter)}
            {groupedDogs[letter].map((dog) => (
              <TouchableOpacity
                key={dog}
                style={styles.dogItem}
                onPress={() => navigateToDogDetail(dog)}
              >
                <ThemedView style={styles.dogCard}>
                  <ThemedText>{dog}</ThemedText>
                  <IconSymbol
                    name="chevron.right"
                    size={20}
                    color={Colors[colorScheme ?? "light"].icon}
                  />
                </ThemedView>
              </TouchableOpacity>
            ))}
          </>
        )}
      />
    );
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchInputWrapper}>
          <IconSymbol
            name="magnifyingglass"
            size={20}
            color={Colors[colorScheme ?? "light"].icon}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            placeholder="Search dog breeds..."
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={styles.clearButton}
            >
              <IconSymbol
                name="xmark.circle.fill"
                size={18}
                color={Colors[colorScheme ?? "light"].icon}
              />
            </TouchableOpacity>
          ) : null}
        </ThemedView>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText style={styles.loadingText}>
            Loading dog breeds...
          </ThemedText>
        </ThemedView>
      ) : filteredBreeds.length === 0 ? (
        <ThemedView style={styles.noResultsContainer}>
          <IconSymbol
            name="magnifyingglass"
            size={50}
            color={Colors[colorScheme ?? "light"].icon}
            style={styles.noResultsIcon}
          />
          <ThemedText style={styles.noResultsText}>
            No dog breeds found matching &quot;{searchQuery}&quot;
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.breedsContainer}>
          {renderAlphabeticalList()}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: "InterTight-Regular",
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  noResultsText: {
    textAlign: "center",
  },
  breedsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionHeaderText: {
    color: "#333",
  },
  dogItem: {
    marginBottom: 8,
  },
  dogCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});
