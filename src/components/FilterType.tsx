// src/components/FilterType.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scroll}
      >
        {/* All button */}
        <AnimatedTouchable
          style={[
            styles.chip,
            selected === null && [styles.chipActive, { backgroundColor: '#0075BE' }]
          ]}
          onPress={() => onSelect(null)}
          entering={FadeInRight.delay(100).springify()}
        >
          <Text style={[
            styles.chipText, 
            selected === null && styles.chipTextActive
          ]}>
            All
          </Text>
        </AnimatedTouchable>

        {types.map((t, index) => {
          const color = TYPE_COLOR[t.name] ?? "#ddd";
          const active = selected === t.name;
          return (
            <AnimatedTouchable
              key={t.name}
              onPress={() => onSelect(active ? null : t.name)}
              style={[
                styles.chip,
                { borderColor: color },
                active && { backgroundColor: color },
              ]}
              entering={FadeInRight.delay(150 + (index * 50)).springify()}
            >
              <Text style={[
                styles.chipText, 
                active && styles.chipTextActive
              ]}>
                {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
              </Text>
            </AnimatedTouchable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8FF',
  },
  scroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActive: {
    shadowColor: "#0075BE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  chipTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});