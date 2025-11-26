import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFavorites } from "../storage/favorites";
import PokemonCard from "../components/PokemonCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootStackParamList";

export default function Favorites() {
  const [favorites, setFavorites] = useState<{ name: string; url: string }[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, []);

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No favorites yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <PokemonCard
          name={item.name}
          url={item.url}
          onPress={() =>
            navigation.navigate("PokemonDetail", { pokemon: item })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
