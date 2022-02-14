import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import tw from "tailwind-react-native-classnames";
import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import "./firebase";
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
