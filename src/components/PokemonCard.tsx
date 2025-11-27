// src/components/PokemonCard.tsx
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // Lebar card yang pas

interface Props {
  name: string;
  url?: string;
  image?: string;
  onPress: () => void;
  index?: number;
}

export default function PokemonCard({ name, url, image, onPress, index = 0 }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  let imageUrl = image;
  if (!imageUrl && url) {
    const id = url.split('/')[url.split('/').length - 2];
    imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  return (
    <Animated.View style={{ 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
      width: CARD_WIDTH, // Fixed width untuk konsistensi
      margin: CARD_MARGIN / 2, // Margin yang konsisten
    }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Background dengan efek gradien */}
        <View style={styles.background} />
        
        {/* Pokemon Image - Lebih besar */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>

        {/* Pokemon Name dengan background */}
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Text>
        </View>

        {/* Blue Accent Line */}
        <View style={styles.accentLine} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
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
    justifyContent: 'space-between', // Space antara image dan name
    height: 180, // Tinggi yang lebih besar
    overflow: 'hidden', // Untuk background
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
  imageContainer: {
    width: 100, // Lebih besar
    height: 100, // Lebih besar
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Di atas background
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
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
    fontSize: 16, // Sedikit lebih besar
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