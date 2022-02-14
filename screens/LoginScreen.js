import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tw.style("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw.style("flex-1")}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          style={[
            tw.style(
              "absolute",
              "bottom-40",
              "w-52",
              "bg-white",
              "p-4",
              "rounded-2xl"
            ),
            { marginHorizontal: "25%" },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw.style("text-center")}>Sign In</Text>
        </TouchableOpacity>
        {/* <Button title="Login" onPress={signInWithGoogle}></Button> */}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
