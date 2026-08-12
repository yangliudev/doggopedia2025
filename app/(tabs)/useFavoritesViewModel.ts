import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export interface DogInfo {
  name: string;
  imageUrl: string | null;
  description: string;
  isLoading: boolean;
}

const FAVORITES_STORAGE_KEY = "dogFavorites";

const buildThumbnailUrl = (wikiImageUrl: string): string => {
  const matches = wikiImageUrl.match(/\/([^\/]+)\/([^\/]+)$/);
  if (matches && matches[1] && matches[2]) {
    const sizePrefixRemoved = matches[2].replace(/^\d+px-/, "");
    return `https://wsrv.nl/?url=https://commons.wikimedia.org/wiki/Special:FilePath/${sizePrefixRemoved}&w=300&h=200&fit=cover&output=webp`;
  }

  return wikiImageUrl;
};

const fetchFavoriteImageUrl = async (dogName: string) => {
  const imageApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    dogName,
  )}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

  const imageResponse = await axios.get(imageApiUrl, {
    headers: { "User-Agent": "Doggopedia/1.0 (educational project)" },
  });

  if (imageResponse.data?.query?.pages) {
    const pages = imageResponse.data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId && pages[pageId]?.thumbnail?.source) {
      return buildThumbnailUrl(pages[pageId].thumbnail.source);
    }
  }

  return null;
};

const fetchFavoriteDescription = async (dogName: string) => {
  const infoApiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${dogName}&origin=*`;
  const infoResponse = await axios.get(infoApiUrl, {
    headers: { "User-Agent": "Doggopedia/1.0 (educational project)" },
  });

  if (infoResponse.data?.query?.pages) {
    const responseData = infoResponse.data.query.pages;
    const values = Object.values(responseData) as { extract?: string }[];
    let description = values[0]?.extract || "";

    if (description.length > 120) {
      description = description.substring(0, 120) + "...";
    }

    return description;
  }

  return "";
};

export function useFavoritesViewModel() {
  const [favorites, setFavorites] = useState<DogInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateFavoriteAt = useCallback(
    (index: number, partial: Partial<DogInfo>) => {
      setFavorites((prevFavorites) => {
        const updatedFavorites = [...prevFavorites];
        updatedFavorites[index] = {
          ...updatedFavorites[index],
          ...partial,
        };
        return updatedFavorites;
      });
    },
    [],
  );

  const fetchDogInfo = useCallback(
    async (dogName: string, index: number) => {
      try {
        const [imageUrl, description] = await Promise.all([
          fetchFavoriteImageUrl(dogName),
          fetchFavoriteDescription(dogName),
        ]);

        updateFavoriteAt(index, {
          imageUrl,
          description,
          isLoading: false,
        });
      } catch (error) {
        console.error(`Error fetching info for ${dogName}:`, error);
        updateFavoriteAt(index, { isLoading: false });
      }
    },
    [updateFavoriteAt],
  );

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

      if (savedFavorites) {
        const favoriteNames = JSON.parse(savedFavorites) as string[];
        const initialFavorites = favoriteNames.map((name) => ({
          name,
          imageUrl: null,
          description: "",
          isLoading: true,
        }));

        setFavorites(initialFavorites);

        favoriteNames.forEach((name, index) => {
          fetchDogInfo(name, index);
        });
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDogInfo]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const removeFavorite = useCallback(
    async (dogName: string) => {
      try {
        const updatedFavorites = favorites.filter(
          (dog) => dog.name !== dogName,
        );
        const updatedFavoriteNames = updatedFavorites.map((dog) => dog.name);

        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavoriteNames),
        );

        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    },
    [favorites],
  );

  return {
    favorites,
    isLoading,
    removeFavorite,
  };
}
