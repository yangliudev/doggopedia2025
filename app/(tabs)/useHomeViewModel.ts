import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface BreedSection {
  title: string;
  dogs: string[];
}

export function useHomeViewModel() {
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDogBreedsData = async () => {
      try {
        const wikiJsonObj = await import("@/api/cleanedData.json");
        const wikiJsonString = wikiJsonObj.default[0]?.dogBreeds;

        if (wikiJsonString) {
          const jsonDataArray = wikiJsonString.split(", ");
          const cleanedBreeds = jsonDataArray
            .filter((breed) => breed && breed.trim())
            .map((breed) => breed.trim());

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

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text) {
        setFilteredBreeds(dogBreeds);
        return;
      }

      const searchTerm = text.toLowerCase();
      const filtered = dogBreeds.filter((breed) =>
        breed.toLowerCase().includes(searchTerm),
      );

      setFilteredBreeds(filtered);
    },
    [dogBreeds],
  );

  const navigateToDogDetail = useCallback((dogName: string) => {
    router.push({
      pathname: "/detail",
      params: { name: dogName },
    });
  }, []);

  const sections = useMemo(() => {
    const groupedDogs = filteredBreeds.reduce(
      (acc, dog) => {
        const firstLetter = dog.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(dog);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return Object.keys(groupedDogs)
      .sort()
      .map((letter) => ({
        title: letter,
        dogs: groupedDogs[letter],
      }));
  }, [filteredBreeds]);

  return {
    searchQuery,
    isLoading,
    sections,
    handleSearch,
    navigateToDogDetail,
  };
}
