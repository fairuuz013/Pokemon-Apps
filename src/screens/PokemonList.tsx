// src/screens/PokemonList.tsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';
import { getPokemonList, getTypes, getPokemonByType } from '../api/pokemonApi';
import FilterType from '../components/FilterType';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParamList';
import NetInfo from '@react-native-community/netinfo';
import { saveCache, loadCache } from '../storage/cache';

type NavProp = StackNavigationProp<RootStackParamList, 'PokemonList'>;

const { width } = Dimensions.get('window');

export default function PokemonList() {
  const navigation = useNavigation<NavProp>();

  const [pokemons, setPokemons] = useState<{ name: string; url: string }[]>([]);
  const [types, setTypes] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offline, setOffline] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const searchRef = useRef<number | null>(null);

  // Cache data original untuk search
  const [originalData, setOriginalData] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    setLoading(true);
    setError(null);

    const net = await NetInfo.fetch();
    const isOffline = !net.isConnected;
    setOffline(isOffline);

    if (isOffline) {
      const cached = await loadCache();
      if (cached) {
        setPokemons(cached);
        setOriginalData(cached);
        try {
          const typesData = await getTypes();
          setTypes(typesData);
        } catch (err) {}
        setLoading(false);
        return;
      }
    }

    try {
      const [listData, typesData] = await Promise.all([
        getPokemonList(200, 0),
        getTypes(),
      ]);

      setPokemons(listData.results);
      setOriginalData(listData.results);
      setTypes(typesData);
      saveCache(listData.results);

    } catch (err) {
      console.error(err);
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  // Optimize dengan useCallback
  const handleSelectType = useCallback(async (typeName: string | null) => {
    setSelectedType(typeName);
    setError(null);

    if (!typeName) {
      // Reset ke data original
      setPokemons(originalData);
      return;
    }

    setLoadingFilter(true);
    try {
      const mapped = await getPokemonByType(typeName);
      setPokemons(mapped);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat tipe Pokémon.');
    } finally {
      setLoadingFilter(false);
    }
  }, [originalData]);

  // Optimize search dengan useMemo
  const filteredPokemons = useMemo(() => {
    if (!search.trim()) return pokemons;
    
    const query = search.trim().toLowerCase();
    return pokemons.filter(p => 
      p.name.toLowerCase().includes(query)
    );
  }, [pokemons, search]);

  // Debounce search
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);

    searchRef.current = setTimeout(() => {
      // Search logic sekarang handle oleh useMemo
    }, 400);

    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [search]);

  // Optimize FlatList render
  const renderPokemonCard = useCallback(({ item, index }: { item: { name: string; url: string }, index: number }) => (
    <PokemonCard
      name={item.name}
      url={item.url}
      onPress={() => navigation.navigate('PokemonDetail', { pokemon: item })}
      index={index}
    />
  ), [navigation]);

  const keyExtractor = useCallback((item: { name: string; url: string }) => item.name, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0075BE" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📶 Offline Mode - Using Cached Data</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <SearchBar value={search} onChange={setSearch} />
        <FilterType types={types} selected={selectedType} onSelect={handleSelectType} />
      </View>

      {loadingFilter && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0075BE" />
          <Text style={styles.loadingFilterText}>Applying filter...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredPokemons}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderPokemonCard}
        removeClippedSubviews={true} // Improve performance
        maxToRenderPerBatch={10} // Reduce initial render
        updateCellsBatchingPeriod={50} // Batch updates
        windowSize={21} // Reduce window size
        initialNumToRender={20}
      />
    </SafeAreaView>
  );
}

// Styles tetap sama...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0075BE',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8FF',
    shadowColor: '#0075BE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0075BE',
    textAlign: 'center',
    marginBottom: 12,
  },
  offlineBanner: {
    backgroundColor: '#FFD166',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFC043',
  },
  offlineText: {
    fontWeight: '600',
    color: '#8A6500',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  loadingFilterText: {
    marginLeft: 8,
    color: '#0075BE',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#C62828',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});