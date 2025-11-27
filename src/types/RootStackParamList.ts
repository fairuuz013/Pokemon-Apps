import { PokemonDetailParam } from "./PokemonDetailParam";

export type RootStackParamList = {
  Tabs: undefined;
  HomeStack: undefined;
  PokemonList: undefined;
  PokemonDetail: { pokemon: PokemonDetailParam };
  Favorites: undefined;
};
