// src/components/SearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search Pokémon..." }: Props) {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.delay(50).springify()}
    >
      <View style={styles.searchContainer}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <View style={styles.iconContainer}>
         
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    position: 'relative',
  },
  input: {    
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#E0E8FF",
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    shadowColor: "#0075BE",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    opacity: 0.7,
  },
});