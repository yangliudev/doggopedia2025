import React from "react";
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
import { useHomeViewModel } from "./useHomeViewModel";

export default function HomeScreen() {
  const {
    searchQuery,
    isLoading,
    sections,
    handleSearch,
    navigateToDogDetail,
  } = useHomeViewModel();
  const colorScheme = useColorScheme();

  const renderSectionHeader = (letter: string) => (
    <ThemedView
      style={[
        styles.sectionHeader,
        {
          backgroundColor: Colors[colorScheme ?? "light"].primary,
        },
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[
          styles.sectionHeaderText,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
      >
        {letter}
      </ThemedText>
    </ThemedView>
  );

  const renderAlphabeticalList = () => (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <>
          {renderSectionHeader(item.title)}
          {item.dogs.map((dog) => (
            <TouchableOpacity
              key={dog}
              style={styles.dogItem}
              onPress={() => navigateToDogDetail(dog)}
            >
              <ThemedView
                style={[
                  styles.dogCard,
                  {
                    backgroundColor: Colors[colorScheme ?? "light"].surface,
                  },
                ]}
              >
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

  return (
    <ThemedView
      style={[
        styles.mainContainer,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <ThemedView
        style={[
          styles.searchContainer,
          { borderBottomColor: Colors[colorScheme ?? "light"].border },
        ]}
      >
        <ThemedView
          style={[
            styles.searchInputWrapper,
            {
              backgroundColor: Colors[colorScheme ?? "light"].searchBackground,
            },
          ]}
        >
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
      ) : sections.length === 0 ? (
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
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
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
