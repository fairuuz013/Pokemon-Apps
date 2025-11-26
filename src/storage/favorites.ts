import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITE_POKEMONS";

export async function getFavorites(): Promise<{name: string; url: string}[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function addFavorite(pokemon: {name: string; url: string}) {
  const current = await getFavorites();
  const newList = [...current, pokemon];
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
}

export async function removeFavorite(name: string) {
  const current = await getFavorites();
  const newList = current.filter((p) => p.name !== name);
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
}

export async function isFavorite(name: string): Promise<boolean> {
  const current = await getFavorites();
  return current.some((p) => p.name === name);
}
