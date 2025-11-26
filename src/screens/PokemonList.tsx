// src/screens/PokemonList.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import PokemonCard from "../components/PokemonCard";
import { getPokemonList, getTypes, getPokemonByType } from "../api/pokemonApi";
import FilterType from "../components/FilterType";
import SearchBar from "../components/SearchBar";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootStackParamList";

type NavProp = StackNavigationProp<RootStackParamList, "PokemonList">;

export default function PokemonList() {
  const navigation = useNavigation<NavProp>();

  const [pokemons, setPokemons] = useState<{ name: string; url: string }[]>([]);
  const [types, setTypes] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filter/search states
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef<number | null>(null);


  // initial load: types + default list
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    setLoading(true);
    try {
      const [listData, typesData] = await Promise.all([getPokemonList(20, 0), getTypes()]);
      setPokemons(listData.results);
      setTypes(typesData);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data. Coba ulang.");
    } finally {
      setLoading(false);
    }
  };

  // handle type selection
  const handleSelectType = async (typeName: string | null) => {
    setSelectedType(typeName);
    setError(null);

    if (!typeName) {
      // restore default list
      setLoadingFilter(true);
      try {
        const listData = await getPokemonList(20, 0);
        setPokemons(listData.results);
      } catch (err) {
        setError("Gagal memuat daftar.");
      } finally {
        setLoadingFilter(false);
      }
      return;
    }

    // fetch pokemons by type
    setLoadingFilter(true);
    try {
      const mapped = await getPokemonByType(typeName);
      setPokemons(mapped);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat tipe Pokémon.");
    } finally {
      setLoadingFilter(false);
    }
  };

  // search with debounce
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      applySearchFilter(search);
    }, 400);

    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [search]);

  const applySearchFilter = async (q: string) => {
    const query = q.trim().toLowerCase();
    if (query === "") {
      // if no search, reload based on selectedType or default
      if (selectedType) {
        await handleSelectType(selectedType);
      } else {
        const d = await getPokemonList(20, 0);
        setPokemons(d.results);
      }
      return;
    }

    // If a type is selected, filter within that set (we already have pokemons state)
    // Otherwise search on default list via API endpoint (we'll request many results to search locally)
    setLoadingFilter(true);
    try {
      if (selectedType) {
        const filtered = pokemons.filter(p => p.name.includes(query));
        setPokemons(filtered);
      } else {
        // fetch a larger chunk (first 200) to search by name (PokeAPI doesn't have search endpoint)
        const res = await getPokemonList(200, 0);
        const found = res.results.filter(r => r.name.includes(query));
        setPokemons(found);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mencari Pokémon.");
    } finally {
      setLoadingFilter(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <SearchBar value={search} onChange={setSearch} />
        <FilterType types={types} selected={selectedType} onSelect={handleSelectType} />
      </View>

      {loadingFilter && (
        <View style={{ padding: 10 }}>
          <ActivityIndicator size="small" color="#e3350d" />
        </View>
      )}

      {error && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonCard
            name={item.name}
            url={item.url}
            onPress={() => navigation.navigate("PokemonDetail", { pokemon: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { backgroundColor: "#f6f6f6", paddingBottom: 8 },
});
