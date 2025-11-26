// src/navigation/RootNavigator.tsx
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import PokemonDetail from "../screens/PokemonDetail";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="PokemonDetail"
        component={PokemonDetail}
        options={{ title: "Pokemon Detail" }}
      />
    </Stack.Navigator>
  );
}
