// src/components/FilterType.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

interface Props {
  types: { name: string }[];
  selected?: string | null;
  onSelect: (type: string | null) => void;
}

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

export default function FilterType({ types, selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* All button */}
        <TouchableOpacity
          style={[styles.chip, selected === null && styles.chipActive]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.chipText, selected === null && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>

        {types.map(t => {
          const color = TYPE_COLOR[t.name] ?? "#ddd";
          const active = selected === t.name;
          return (
            <TouchableOpacity
              key={t.name}
              onPress={() => onSelect(active ? null : t.name)}
              style={[
                styles.chip,
                { borderColor: color },
                active && { backgroundColor: color },
              ]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {t.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    backgroundColor: "white",
  },
  chipActive: {
    // active bg handled inline using color
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  chipTextActive: {
    color: "white",
  },
});
