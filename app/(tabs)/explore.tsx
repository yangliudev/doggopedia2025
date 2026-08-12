import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DOG_CATEGORIES,
  DOG_FACTS,
  GROOMING_TIPS,
  HEALTH_TIPS,
  TRAINING_TIPS,
} from "@/constants/dogData";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ExploreScreen() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const colorScheme = useColorScheme();

  // Using useCallback for event handlers to prevent unnecessary re-renders
  const showNextFact = useCallback(() => {
    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % DOG_FACTS.length);
  }, []);

  const showPrevFact = useCallback(() => {
    setCurrentFactIndex((prevIndex) =>
      prevIndex === 0 ? DOG_FACTS.length - 1 : prevIndex - 1,
    );
  }, []);

  const nextCategory = useCallback(() => {
    setSelectedCategory((prev) => (prev + 1) % DOG_CATEGORIES.length);
  }, []);

  const prevCategory = useCallback(() => {
    setSelectedCategory((prev) =>
      prev === 0 ? DOG_CATEGORIES.length - 1 : prev - 1,
    );
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <ThemedView
        style={[
          styles.heroContainer,
          { borderBottomColor: Colors[colorScheme ?? "light"].border },
        ]}
        useBackground={false}
      >
        <ThemedText type="title" style={styles.heroTitle}>
          Discover Dogs
        </ThemedText>
        <ThemedView style={styles.heroSubtitleContainer} useBackground={false}>
          <ThemedText style={styles.heroSubtitle}>
            Learn about different breeds, care tips, and fascinating dog facts
          </ThemedText>
          <IconSymbol
            name="pawprint.fill"
            size={24}
            color={Colors[colorScheme ?? "light"].tint}
            style={styles.heroIcon}
          />
        </ThemedView>
      </ThemedView>

      {/* Fun Facts Card with enhanced styling */}
      <ThemedView
        style={[
          styles.card,
          styles.factCard,
          {
            backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
            borderLeftColor: Colors[colorScheme ?? "light"].tint,
          },
        ]}
        useBackground={true}
      >
        <ThemedView style={styles.cardHeader} useBackground={false}>
          <IconSymbol
            name="pawprint.fill"
            size={22}
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Fun Dog Facts
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.factContainer} useBackground={false}>
          <TouchableOpacity onPress={showPrevFact} style={styles.arrowButton}>
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>

          <ThemedView
            style={[
              styles.factTextContainer,
              {
                backgroundColor: Colors[colorScheme ?? "light"].surface,
              },
            ]}
            useBackground={false}
          >
            <ThemedText style={styles.factText}>
              {DOG_FACTS[currentFactIndex]}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity onPress={showNextFact} style={styles.arrowButton}>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.progressBarContainer} useBackground={false}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor:
                  colorScheme === "dark" ? "rgba(255,255,255,0.12)" : "#e0e0e0",
              },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    ((currentFactIndex + 1) / DOG_FACTS.length) * 100
                  }%`,
                  backgroundColor: Colors[colorScheme ?? "light"].tint,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.factCounter}>
            Fact {currentFactIndex + 1} of {DOG_FACTS.length}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Dog Categories Carousel */}
      <ThemedView style={styles.sectionTitleContainer} useBackground={false}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Dog Categories
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.card,
          styles.categoryCard,
          {
            backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
          },
        ]}
        useBackground={true}
      >
        <Image
          source={{ uri: DOG_CATEGORIES[selectedCategory].image }}
          style={styles.categoryImage}
          contentFit="cover"
          transition={300}
        />

        <ThemedView style={styles.categoryControls} useBackground={false}>
          <TouchableOpacity onPress={prevCategory} style={styles.categoryArrow}>
            <MaterialIcons name="chevron-left" size={22} color="#fff" />
          </TouchableOpacity>

          <ThemedText style={styles.categoryName}>
            {DOG_CATEGORIES[selectedCategory].name}
          </ThemedText>

          <TouchableOpacity onPress={nextCategory} style={styles.categoryArrow}>
            <MaterialIcons name="chevron-right" size={22} color="#fff" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.categoryDetails} useBackground={false}>
          <ThemedText style={styles.categoryDescription}>
            {DOG_CATEGORIES[selectedCategory].description}
          </ThemedText>
          <ThemedText style={styles.categoryExamples}>
            <ThemedText style={{ fontWeight: "bold" }}>Examples: </ThemedText>
            {DOG_CATEGORIES[selectedCategory].examples}
          </ThemedText>

          <ThemedView style={styles.dotsContainer}>
            {DOG_CATEGORIES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === selectedCategory
                        ? Colors[colorScheme ?? "light"].tint
                        : "#D0D0D0",
                  },
                ]}
              />
            ))}
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Dog Anatomy Section with better styling */}
      <ThemedView style={styles.sectionTitleContainer} useBackground={false}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Dog Anatomy
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.card,
          styles.anatomyCard,
          {
            backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
            borderLeftColor: Colors[colorScheme ?? "light"].icon,
          },
        ]}
        useBackground={true}
      >
        <ThemedView style={styles.anatomyImageContainer} useBackground={false}>
          <Image
            source={require("@/assets/images/dog_anatomy.jpg")}
            style={styles.anatomyImage}
            contentFit="cover"
            transition={500}
          />
        </ThemedView>
        <ThemedText style={styles.anatomyTitle}>Dog Body Parts</ThemedText>
        <ThemedText style={styles.anatomyCaption}>
          Understanding dog anatomy helps you better care for your pet and
          communicate with veterinarians effectively about potential health
          issues.
        </ThemedText>
      </ThemedView>

      {/* Dog Care Tips Section */}
      <ThemedView style={styles.sectionTitleContainer} useBackground={false}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Dog Care Tips
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.tipsContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
            borderLeftColor: Colors[colorScheme ?? "light"].icon,
          },
        ]}
        useBackground={true}
      >
        {/* Training Tips */}
        <Collapsible title="Basic Training Tips">
          {TRAINING_TIPS.map((tip, index) => (
            <ThemedText key={index} style={styles.tipText}>
              • {tip}
            </ThemedText>
          ))}
        </Collapsible>

        {/* Health Tips */}
        <Collapsible title="Health & Wellness">
          {HEALTH_TIPS.map((tip, index) => (
            <ThemedText key={index} style={styles.tipText}>
              • {tip}
            </ThemedText>
          ))}
        </Collapsible>

        {/* Grooming Tips */}
        <Collapsible title="Grooming Advice">
          {GROOMING_TIPS.map((tip, index) => (
            <ThemedText key={index} style={styles.tipText}>
              • {tip}
            </ThemedText>
          ))}
        </Collapsible>
      </ThemedView>

      {/* Quick Links */}
      <ThemedView
        style={[
          styles.quickLinksContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
            borderLeftColor: Colors[colorScheme ?? "light"].icon,
          },
        ]}
        useBackground={true}
      >
        <ThemedView style={styles.quickLinksHeader} useBackground={false}>
          <IconSymbol
            name="heart.fill"
            size={20}
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText type="subtitle" style={styles.quickLinksTitle}>
            Popular Breeds
          </ThemedText>
        </ThemedView>

        <Link href="/detail?name=Golden%20Retriever&from=explore" asChild>
          <TouchableOpacity style={styles.quickLink}>
            <ThemedText style={styles.quickLinkText}>
              Golden Retriever
            </ThemedText>
            <ThemedView
              style={[
                styles.quickLinkArrow,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
              useBackground={true}
            >
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>

        <Link href="/detail?name=German%20Shepherd&from=explore" asChild>
          <TouchableOpacity style={styles.quickLink}>
            <ThemedText style={styles.quickLinkText}>
              German Shepherd
            </ThemedText>
            <ThemedView
              style={[
                styles.quickLinkArrow,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
              useBackground={true}
            >
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>

        <Link href="/detail?name=Labrador%20Retriever&from=explore" asChild>
          <TouchableOpacity style={styles.quickLink}>
            <ThemedText style={styles.quickLinkText}>
              Labrador Retriever
            </ThemedText>
            <ThemedView
              style={[
                styles.quickLinkArrow,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
              useBackground={true}
            >
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      <ThemedView style={styles.footer} useBackground={false}>
        <ThemedView
          style={[
            styles.footerDivider,
            { backgroundColor: Colors[colorScheme ?? "light"].border },
          ]}
          useBackground={false}
        />
        <IconSymbol
          name="pawprint.fill"
          size={28}
          color={Colors[colorScheme ?? "light"].tint}
          style={styles.footerIcon}
        />
        <ThemedText style={styles.footerText}>
          Doggopedia - Your Source for Dog Knowledge
        </ThemedText>
        <ThemedText style={styles.footerVersion}>
          Created with ❤️ by Yang Liu
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
  heroContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  heroTitle: {
    fontSize: 29,
    marginBottom: 12,
    fontWeight: "700",
  },
  heroSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
    flex: 1,
  },
  heroIcon: {
    marginLeft: 8,
    opacity: 0.8,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    textAlign: "center",
  },
  factCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#8e4b8e",
  },
  factContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  factTextContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  factText: {
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
  },
  arrowButton: {
    padding: 8,
  },
  progressBarContainer: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  factCounter: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
  },
  sectionTitleContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    paddingHorizontal: 4,
  },
  categoryCard: {
    padding: 0,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: 180,
  },
  categoryControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  categoryArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  categoryDetails: {
    padding: 16,
  },
  categoryDescription: {
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  categoryExamples: {
    fontSize: 14,
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  anatomyCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4b8e8e",
  },
  anatomyImageContainer: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  anatomyImage: {
    width: "100%",
    height: "100%",
  },
  anatomyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#4b8e8e",
  },
  anatomyCaption: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#4b618e",
  },
  tipText: {
    marginBottom: 10,
    paddingLeft: 6,
    lineHeight: 20,
    fontSize: 14,
  },
  learnMoreButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  learnMoreText: {
    color: "#8e4b8e",
    fontWeight: "600",
  },
  quickLinksContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#8e4b61",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickLinksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  quickLinksTitle: {
    marginBottom: 0,
  },
  quickLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: "500",
  },
  quickLinkArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8e4b61",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: 40,
    marginBottom: 50,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  footerDivider: {
    height: 1,
    width: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 20,
  },
  footerIcon: {
    marginBottom: 12,
    opacity: 0.7,
  },
  footerText: {
    opacity: 0.7,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  footerVersion: {
    opacity: 0.5,
    fontSize: 13,
  },
});
