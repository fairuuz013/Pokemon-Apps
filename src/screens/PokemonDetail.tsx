// src/screens/PokemonDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/favoriteStorage";

export default function PokemonDetail() {
  const route = useRoute<any>();
  const paramPokemon = route.params.pokemon;

  const [detail, setDetail] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchDetail = async () => {
    try {
      let url = "";

      if (paramPokemon.id) {
        url = `https://pokeapi.co/api/v2/pokemon/${paramPokemon.id}`;
      } else if (paramPokemon.url) {
        url = paramPokemon.url;
      } else {
        url = `https://pokeapi.co/api/v2/pokemon/${paramPokemon.name}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setDetail(data);
      
      // Start fade animation setelah data loaded
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.log("Fetch detail error:", e);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    const exist = await isFavorite(paramPokemon.name);
    setFavorite(Boolean(exist));
  };

  useEffect(() => {
    fetchDetail();
    checkFavoriteStatus();
  }, []);

  const handleFavorite = async () => {
    if (!detail) return;

    const toStore = {
      id: detail.id,
      name: detail.name,
      sprite: detail.sprites?.front_default ?? null,
    };

    if (favorite) {
      await removeFavorite(detail.id);
      setFavorite(false);
    } else {
      await addFavorite(toStore);
      setFavorite(true);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0075BE" />
        <Text style={styles.loadingText}>Loading Pokémon data...</Text>
      </View>
    );

  if (!detail)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pokémon data not available.</Text>
      </View>
    );

  const officialArt =
    detail.sprites?.other?.["official-artwork"]?.front_default ??
    detail.sprites?.front_default ??
    paramPokemon.sprite ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${paramPokemon.id}.png`;

  // Get primary type for color scheme
  const primaryType = detail.types?.[0]?.type?.name || 'normal';
  const typeColor = TYPE_COLOR[primaryType] || '#0075BE';

  return (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: `${typeColor}20` }]}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{detail.name.toUpperCase()}</Text>
          <Text style={styles.id}>#{String(detail.id).padStart(3, '0')}</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.favoriteButton,
            favorite && styles.favoriteButtonActive
          ]} 
          onPress={handleFavorite}
        >
          <Text style={styles.favoriteIcon}>
            {favorite ? "★" : "☆"}
          </Text>
          <Text style={styles.favoriteText}>
            {favorite ? "Favorited" : "Add Favorite"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image 
          source={{ uri: officialArt }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Type Badges */}
      <View style={styles.typeContainer}>
        {detail.types.map((t: any, index: number) => (
          <View 
            key={t.type.name}
            style={[
              styles.typeBadge,
              { backgroundColor: TYPE_COLOR[t.type.name] || '#ddd' }
            ]}
          >
            <Text style={styles.typeText}>
              {t.type.name.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Info</Text>
        <View style={styles.infoTable}>
          <View style={styles.row}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.value}>{(detail.height / 10).toFixed(1)} m</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>{(detail.weight / 10).toFixed(1)} kg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Base Experience</Text>
            <Text style={styles.value}>{detail.base_experience || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Stats</Text>
        {detail.stats.map((item: any, idx: number) => (
          <View key={idx} style={styles.statRow}>
            <View style={styles.statHeader}>
              <Text style={styles.statName}>
                {item.stat.name.replace('-', ' ').toUpperCase()}
              </Text>
              <Text style={styles.statValue}>{item.base_stat}</Text>
            </View>
            
            <View style={styles.statBarBackground}>
              <View
                style={[
                  styles.statBarFill,
                  { 
                    width: `${Math.min(100, (item.base_stat / 150) * 100)}%`,
                    backgroundColor: typeColor
                  }
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
}

// Add TYPE_COLOR constant untuk detail screen juga
const TYPE_COLOR: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: '#F8FAFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0075BE',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFF",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#2E3156",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  id: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0075BE',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFD700',
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 220,
    height: 220,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#0075BE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2E3156",
  },
  infoTable: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E8FF',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: '#FAFBFF',
  },
  label: { 
    fontSize: 16, 
    color: "#666",
    fontWeight: '500',
  },
  value: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#2E3156" 
  },
  statRow: { 
    marginVertical: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statName: { 
    fontSize: 14, 
    color: "#555",
    fontWeight: '600',
    flex: 1,
  },
  statValue: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#0075BE",
    width: 40,
    textAlign: 'right',
  },
  statBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#E0E8FF",
    borderRadius: 10,
    overflow: 'hidden',
  },
  statBarFill: {
    height: 12,
    borderRadius: 10,
  },
});