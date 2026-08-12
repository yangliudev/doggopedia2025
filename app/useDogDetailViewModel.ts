import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Vibration } from "react-native";

export type DogImageLoadingState = "loading" | "loaded" | "error";

export function useDogDetailViewModel(dogName: string) {
  const [dogInfo, setDogInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [dogImageUrl, setDogImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] =
    useState<DogImageLoadingState>("loading");

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
          "Unable to load information. Please check your connection and try again.",
        );
        setIsLoading(false);
      });
  }, [dogName]);

  const getWikipediaImage = useCallback(() => {
    setImageLoadingState("loading");
    const imageApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      dogName,
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
            const wikiImageUrl = pages[pageId].thumbnail.source;

            try {
              const matches = wikiImageUrl.match(/\/([^\/]+)\/([^\/]+)$/);
              if (matches && matches[1] && matches[2]) {
                const sizePrefixRemoved = matches[2].replace(/^\d+px-/, "");
                const proxyUrl = `https://wsrv.nl/?url=https://commons.wikimedia.org/wiki/Special:FilePath/${sizePrefixRemoved}&w=500&h=400&fit=cover&output=webp`;
                setDogImageUrl(proxyUrl);
              } else {
                setDogImageUrl(wikiImageUrl);
              }
            } catch (error) {
              console.error("Error while creating Wikipedia image URL:", error);
              setDogImageUrl(wikiImageUrl);
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
      .catch(() => {
        setDogImageUrl(null);
        setImageLoadingState("error");
      });
  }, [dogName]);

  const heartScale = useRef(new Animated.Value(1)).current;

  const checkIfFavorite = useCallback(async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(Array.isArray(favorites) && favorites.includes(dogName));
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [dogName]);

  const animateHeart = useCallback(() => {
    heartScale.setValue(1);

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Vibration.vibrate(40);
  }, [heartScale]);

  const toggleFavorite = useCallback(async () => {
    try {
      animateHeart();

      const savedFavorites = await AsyncStorage.getItem("dogFavorites");
      let favorites: string[] = [];

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        favorites = Array.isArray(parsedFavorites) ? parsedFavorites : [];
      }

      const newFavoriteState = !isFavorite;

      if (isFavorite) {
        favorites = favorites.filter((name) => name !== dogName);
      } else {
        favorites.push(dogName);
      }

      await AsyncStorage.setItem("dogFavorites", JSON.stringify(favorites));
      setIsFavorite(newFavoriteState);

      if (newFavoriteState) {
        Vibration.vibrate([0, 40, 50, 40]);
      } else {
        Vibration.vibrate(20);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      Alert.alert("Error", "Could not update favorites. Please try again.");
    }
  }, [dogName, isFavorite, animateHeart]);

  const handleImageError = useCallback(() => {
    setImageLoadingState("error");
  }, []);

  useEffect(() => {
    checkIfFavorite();
    getDogInfoFromApi();
    getWikipediaImage();
  }, [checkIfFavorite, getDogInfoFromApi, getWikipediaImage]);

  return {
    dogInfo,
    isLoading,
    isFavorite,
    dogImageUrl,
    imageLoadingState,
    heartScale,
    toggleFavorite,
    handleImageError,
  };
}
