import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "pokemon_cache";

export const saveCache = async (data: any) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.log("Gagal menyimpan cache", err);
  }
};

export const loadCache = async () => {
  try {
    const json = await AsyncStorage.getItem(CACHE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.log("Gagal memuat cache", err);
    return null;
  }
};
