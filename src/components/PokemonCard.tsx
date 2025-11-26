// src/components/PokemonCard.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

interface Props {
  name: string;
  url: string;
  onPress: () => void;
}

export default function PokemonCard({ name, url, onPress }: Props) {
  const id = url.split("/")[url.split("/").length - 2];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <Text style={styles.sub}>ID: {id}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 4, // shadow android
    shadowColor: "#000", // shadow iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sub: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
