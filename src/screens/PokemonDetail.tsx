// src/screens/PokemonDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";
import { addFavorite, removeFavorite, isFavorite } from "../storage/favorites";

type DetailRouteProp = RouteProp<RootStackParamList, "PokemonDetail">;

export default function PokemonDetail() {
  const route = useRoute<DetailRouteProp>();
  const { pokemon } = route.params;

  const [favorite, setFavorite] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      setDetail(data);
    } catch (err) {
      console.log("Gagal fetch detail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const fav = await isFavorite(pokemon.name);
    setFavorite(fav);
  };

  // ⭐ HANDLE FAVORITE
  const handleFavorite = async () => {
    if (favorite) {
      await removeFavorite(pokemon.name);
      setFavorite(false);
    } else {
      await addFavorite(pokemon);
      setFavorite(true);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );

  if (!detail) {
    return (
      <View style={styles.center}>
        <Text>Gagal memuat detail Pokémon.</Text>
      </View>
    );
  }

  const officialArt =
    detail?.sprites?.other?.["official-artwork"]?.front_default ??
    detail?.sprites?.front_default;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: officialArt }} style={styles.image} />

      <Text style={styles.name}>{detail.name.toUpperCase()}</Text>

      {/* ⭐ FAVORITE BUTTON */}
      <TouchableOpacity onPress={handleFavorite} style={styles.favoriteBtn}>
        <Text style={styles.favoriteText}>
          {favorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
        </Text>
      </TouchableOpacity>

      {/* TYPES */}
      <View style={styles.section}>
        <Text style={styles.title}>Types</Text>
        <View style={styles.row}>
          {detail.types.map((t: any) => (
            <View key={t.slot} style={styles.type}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* INFO */}
      <View style={styles.section}>
        <Text style={styles.title}>Info</Text>
        <Text>Height: {detail.height}</Text>
        <Text>Weight: {detail.weight}</Text>
      </View>

      {/* STATS */}
      <View style={styles.section}>
        <Text style={styles.title}>Stats</Text>
        {detail.stats.map((s: any) => (
          <Text key={s.stat.name}>
            {s.stat.name.toUpperCase()}: {s.base_stat}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 16,
  },

  // ⭐ STYLE FAVORITE BUTTON
  favoriteBtn: {
    backgroundColor: "#e3350d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  favoriteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  section: {
    width: "100%",
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  type: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  typeText: {
    textTransform: "capitalize",
  },
});
