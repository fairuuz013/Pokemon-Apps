// src/api/pokemonApi.ts
import axios from "axios";

const API_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = async (limit = 20, offset = 0) => {
  const res = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return res.data as { results: { name: string; url: string }[]; count: number; };
};

export const getPokemonDetail = async (idOrName: string) => {
  const res = await axios.get(`${API_URL}/pokemon/${idOrName}`);
  return res.data;
};

// get all types (name + url)
export const getTypes = async () => {
  const res = await axios.get(`${API_URL}/type`);
  // returns { results: [{ name, url }, ...] }
  return res.data.results as { name: string; url: string }[];
};

// get pokemon by type name (e.g. "fire")
export const getPokemonByType = async (typeName: string) => {
  const res = await axios.get(`${API_URL}/type/${typeName}`);
  // res.data.pokemon is array of { pokemon: { name, url }, slot }
  const mapped = (res.data.pokemon as any[]).map(p => ({
    name: p.pokemon.name,
    url: p.pokemon.url,
  }));
  return mapped as { name: string; url: string }[];
};
