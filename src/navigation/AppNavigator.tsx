// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./RootNavigator";

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
