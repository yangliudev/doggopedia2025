import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Extracted facts to a separate constant outside the component
const DOG_FACTS = [
  "A dog's sense of smell is about 40 times better than ours.",
  "Dogs can hear sounds up to four times further away than humans.",
  "The tallest dog ever was a Great Dane named Zeus who stood 44 inches tall.",
  "Dogs have three eyelids - an upper, lower, and third lid that helps keep their eyes moist.",
  "A Greyhound can run up to 45 miles per hour, making them the fastest dogs.",
  "Dalmatian puppies are born completely white, with their spots developing as they grow.",
  "Dogs' nose prints are unique - just like human fingerprints.",
  "The Basenji is the only dog breed that doesn't bark, but they make a yodel-like sound.",
  "Newfoundlands have water-resistant coats and webbed feet, making them excellent swimmers.",
  "The Labrador Retriever has been America's most popular dog breed for over 30 years.",
];

export default function ExploreScreen() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const colorScheme = useColorScheme();

  // Using useCallback for event handlers to prevent unnecessary re-renders
  const showNextFact = useCallback(() => {
    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % DOG_FACTS.length);
  }, []);

  const showPrevFact = useCallback(() => {
    setCurrentFactIndex((prevIndex) =>
      prevIndex === 0 ? DOG_FACTS.length - 1 : prevIndex - 1
    );
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Discover Dogs</ThemedText>
      </ThemedView>

      {/* Fun Facts Card */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          Fun Dog Facts
        </ThemedText>

        <ThemedView style={styles.factContainer}>
          <TouchableOpacity onPress={showPrevFact} style={styles.arrowButton}>
            <IconSymbol
              name="chevron.left"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>

          <ThemedText style={styles.factText}>
            {DOG_FACTS[currentFactIndex]}
          </ThemedText>

          <TouchableOpacity onPress={showNextFact} style={styles.arrowButton}>
            <IconSymbol
              name="chevron.right"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedText style={styles.factCounter}>
          Fact {currentFactIndex + 1} of {DOG_FACTS.length}
        </ThemedText>
      </ThemedView>

      {/* Dog Anatomy Section */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          Dog Anatomy
        </ThemedText>

        <Image
          source={{
            uri: "https://www.researchgate.net/profile/Thapana-Kittikorn/publication/342646590/figure/fig1/AS:908771866275840@1593658746769/Dog-anatomy-and-23-body-parts-1-nose-2-bridge-of-the-nose-3-stop-4-forehead-5.png",
          }}
          style={styles.anatomyImage}
          resizeMode="contain"
        />
      </ThemedView>

      {/* Dog Training Tips */}
      <Collapsible title="Basic Training Tips">
        <ThemedText style={styles.tipText}>
          • Start training your puppy as soon as you bring them home
        </ThemedText>
        <ThemedText style={styles.tipText}>
          • Use positive reinforcement with treats and praise
        </ThemedText>
        <ThemedText style={styles.tipText}>
          • Keep training sessions short (5-10 minutes) and fun
        </ThemedText>
      </Collapsible>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Doggopedia - Your Source for Dog Knowledge
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  factContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  factText: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  arrowButton: {
    padding: 8,
  },
  factCounter: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
  },
  anatomyImage: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  tipText: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  footerText: {
    opacity: 0.6,
    fontSize: 12,
  },
});
