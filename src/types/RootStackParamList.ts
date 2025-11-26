import { Pokemon } from "./Pokemon";

export type RootStackParamList = {
  Tabs: undefined;
  HomeStack: undefined;
  PokemonList: undefined;
  PokemonDetail: { pokemon: Pokemon };
  Favorites: undefined;
};
