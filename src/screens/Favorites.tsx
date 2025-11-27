// src/screens/Favorites.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootStackParamList";
import { getFavorites } from "../utils/favoriteStorage";

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

type NavProp = StackNavigationProp<RootStackParamList, "Favorites">;

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigation = useNavigation<NavProp>();

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadFavorites);
    loadFavorites();
    return unsub;
  }, [navigation]);

  if (favorites.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No favorites yet.</Text>
        <Text style={styles.emptySubtext}>Add some Pokémon to your favorites!</Text>
      </View>
    );

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.name}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const imageUri =
          item.sprite ||
          item.image ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("PokemonDetail", {
                pokemon: { name: item.name, id: item.id, sprite: item.sprite },
              })
            }
          >
            <View style={styles.background} />
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            </View>
            <View style={styles.accentLine} />
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F8FAFF',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0075BE',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 8,
    backgroundColor: '#F8FAFF',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    margin: CARD_MARGIN / 2,
    shadowColor: '#0075BE',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 180,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#F8FAFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
  },
  nameContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3156',
    textAlign: 'center',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 4,
    backgroundColor: '#0075BE',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});