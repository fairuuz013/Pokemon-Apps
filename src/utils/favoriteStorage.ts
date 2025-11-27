import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoritePokemon = {
  id: number;
  name: string;
  sprite: string | null;
};

const FAVORITES_KEY = "FAVORITE_POKEMON";

// ------------------------------------------------------
// GET FAVORITES
// ------------------------------------------------------
export const getFavorites = async (): Promise<FavoritePokemon[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error get favorites:", error);
    return [];
  }
};

// ------------------------------------------------------
// ADD FAVORITE
// ------------------------------------------------------
export const addFavorite = async (pokemon: FavoritePokemon) => {
  try {
    const favorites = await getFavorites();

    // Cek kalo udah ada → jangan double
    const exists = favorites.some((p) => p.id === pokemon.id);
    if (exists) return;

    favorites.push(pokemon);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.log("Error add favorite:", error);
  }
};

// ------------------------------------------------------
// REMOVE FAVORITE
// ------------------------------------------------------
export const removeFavorite = async (id: number) => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((p) => p.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("Error remove favorite:", error);
  }
};

// ------------------------------------------------------
// CHECK FAVORITE
// ------------------------------------------------------
export const isFavorite = async (id: number | string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(
      (p) =>
        p.id === id ||
        p.name.toLowerCase() === String(id).toLowerCase()
    );
  } catch (error) {
    console.log("Error isFavorite:", error);
    return false;
  }
};
