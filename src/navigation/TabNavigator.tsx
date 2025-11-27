// src/navigation/TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import Favorites from "../screens/Favorites";
import  FontAwesome6  from '@react-native-vector-icons/fontawesome6';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0075BE',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E8FF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#0075BE',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
  name="Home" 
  component={HomeStack} 
  options={{
    headerShown: false,
    tabBarIcon: ({ color, focused }) => (
   <FontAwesome6
  name="user"
  size={focused ? 26 : 22}
  color={color}
/>
    ),
  }}
/>

<Tab.Screen 
  name="Favorites" 
  component={Favorites}
  options={{
    title: "My Favorites",
    tabBarIcon: ({ color, focused }) => (
      <FontAwesome6
        name="heart"
        size={focused ? 26 : 22}
        color={color}
      />
    ),
  }}
/>

    </Tab.Navigator>
  );
}
