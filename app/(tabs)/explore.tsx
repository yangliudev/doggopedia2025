import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Extracted facts to a separate constant outside the component
const DOG_FACTS = [
  "A dog's sense of smell is about 40 times better than ours, and they can detect some odors in parts per trillion.",
  "Dogs can hear sounds up to four times further away than humans and can detect frequencies humans cannot.",
  "The tallest dog ever was a Great Dane named Zeus who stood 44 inches tall and measured 7'4\" on his hind legs.",
  "Dogs have three eyelids - an upper, lower, and third lid (nictitating membrane) that helps keep their eyes moist and protected.",
  "A Greyhound can run up to 45 miles per hour, making them the fastest dogs and one of the fastest land animals.",
  "Dalmatian puppies are born completely white, with their spots developing as they grow during the first weeks of life.",
  "Dogs' nose prints are unique - just like human fingerprints - and can be used for identification.",
  "The Basenji is the only dog breed that doesn't bark, but they make a yodel-like sound called a 'baroo'.",
  "Newfoundlands have water-resistant coats and webbed feet, making them excellent swimmers and rescue dogs.",
  "The Labrador Retriever has been America's most popular dog breed for over 30 years according to AKC registrations.",
  "Dogs can smell human emotions and can detect when people are stressed or afraid.",
  "The Norwegian Lundehund is the only dog with six toes on each foot, evolved for climbing steep cliffs.",
  "Dogs can be trained to detect medical conditions like cancer, diabetes, and epileptic seizures before they occur.",
  "A dog's average body temperature is higher than humans at about 101-102.5°F (38.3-39.2°C).",
  "The Bloodhound's sense of smell is so accurate that their tracking results are admissible as evidence in court.",
];

// Dog categories with examples and descriptions
const DOG_CATEGORIES = [
  {
    id: 1,
    name: "Working Dogs",
    description:
      "Bred for jobs such as guarding property, pulling sleds and performing water rescues",
    examples: "Siberian Husky, Bernese Mountain Dog, Doberman Pinscher",
    image:
      "https://www.akc.org/wp-content/uploads/2017/11/Siberian-Husky-standing-outdoors-in-the-winter.jpg",
  },
  {
    id: 2,
    name: "Herding Dogs",
    description:
      "Bred to gather, herd, and protect livestock such as sheep and cattle",
    examples: "Border Collie, Australian Shepherd, German Shepherd",
    image:
      "https://www.akc.org/wp-content/uploads/2017/11/Border-Collie-on-seesaw-in-agility.jpg",
  },
  {
    id: 3,
    name: "Sporting Dogs",
    description: "Developed to assist hunters in finding and retrieving game",
    examples: "Labrador Retriever, Golden Retriever, Pointer",
    image:
      "https://www.akc.org/wp-content/uploads/2017/11/Golden-Retriever-Slide-11.jpg",
  },
  {
    id: 4,
    name: "Toy Dogs",
    description:
      "Small companion dogs, perfect for apartment living and lap warming",
    examples: "Chihuahua, Pomeranian, Shih Tzu",
    image:
      "https://www.akc.org/wp-content/uploads/2017/11/Pomeranian-On-White-01.jpg",
  },
  {
    id: 5,
    name: "Hound Dogs",
    description: "Bred for hunting by sight or scent",
    examples: "Beagle, Bloodhound, Greyhound",
    image:
      "https://www.akc.org/wp-content/uploads/2017/11/Beagles-standing-in-a-frosty-field-on-a-cold-morning.jpg",
  },
];

// Define some dog care tips for different sections
const TRAINING_TIPS = [
  "Start training your puppy as soon as you bring them home",
  "Use positive reinforcement with treats and praise",
  "Keep training sessions short (5-10 minutes) and fun",
  "Be consistent with commands and expectations",
  "Socialize your puppy with different people, pets, and environments",
  "Focus on one command at a time until mastered",
  "Always end training sessions on a positive note",
];

const HEALTH_TIPS = [
  "Schedule regular veterinary check-ups (at least once a year)",
  "Keep vaccinations up-to-date",
  "Maintain dental hygiene with regular brushing",
  "Provide regular exercise appropriate for your dog's breed and age",
  "Feed high-quality dog food appropriate for your dog's life stage",
  "Monitor weight to prevent obesity",
  "Check ears, eyes, and teeth regularly for signs of problems",
];

const GROOMING_TIPS = [
  "Brush your dog regularly based on coat type",
  "Bathe only when necessary to preserve natural oils",
  "Trim nails regularly before they get too long",
  "Clean ears to prevent infection",
  "Brush teeth several times a week to prevent dental issues",
  "Check for parasites like fleas and ticks after outdoor activities",
  "Consider professional grooming for breeds with special coat needs",
];

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
      prevIndex === 0 ? DOG_FACTS.length - 1 : prevIndex - 1
    );
  }, []);

  const nextCategory = useCallback(() => {
    setSelectedCategory((prev) => (prev + 1) % DOG_CATEGORIES.length);
  }, []);

  const prevCategory = useCallback(() => {
    setSelectedCategory((prev) =>
      prev === 0 ? DOG_CATEGORIES.length - 1 : prev - 1
    );
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <ThemedView style={styles.heroContainer} useBackground={false}>
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
      <ThemedView style={[styles.card, styles.factCard]} useBackground={true}>
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

          <ThemedView style={styles.factTextContainer} useBackground={true}>
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
          <View style={styles.progressBar}>
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
        style={[styles.card, styles.categoryCard]}
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
        style={[styles.card, styles.anatomyCard]}
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

      <ThemedView style={styles.tipsContainer} useBackground={true}>
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
      <ThemedView style={styles.quickLinksContainer} useBackground={true}>
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
            <ThemedView style={styles.quickLinkArrow} useBackground={true}>
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>

        <Link href="/detail?name=German%20Shepherd&from=explore" asChild>
          <TouchableOpacity style={styles.quickLink}>
            <ThemedText style={styles.quickLinkText}>
              German Shepherd
            </ThemedText>
            <ThemedView style={styles.quickLinkArrow} useBackground={true}>
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>

        <Link href="/detail?name=Labrador%20Retriever&from=explore" asChild>
          <TouchableOpacity style={styles.quickLink}>
            <ThemedText style={styles.quickLinkText}>
              Labrador Retriever
            </ThemedText>
            <ThemedView style={styles.quickLinkArrow} useBackground={true}>
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      <ThemedView style={styles.footer} useBackground={false}>
        <ThemedView style={styles.footerDivider} useBackground={false} />
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
