import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import { useNavigation, useRoute } from "@react-navigation/native";

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const { loggedInProfile, userSwiped } = params;
  return (
    <View style={tw.style("h-full bg-red-500 pt-20")}>
      <View style={tw.style("justify-center px-10 pt-20")}>
        <Image
          source={{
            uri: "https://i.picsum.photos/id/507/200/300.jpg?hmac=v0NKvUrOWTKZuZFmMlLN_7-RdRgeF-qFLeBGXpufxgg",
          }}
        />
      </View>
      <Text> You and {userSwiped.displayName} Matched</Text>

      <View style={tw.style("flex-row justify-evenly mt-5")}>
        <Image
          style={tw.style("h-32 w-32 rounded-full")}
          source={{ uri: loggedInProfile.photoURL }}
        />
        <Image
          style={tw.style("h-32 w-32 rounded-full")}
          source={{ uri: userSwiped.photoURL }}
        />
      </View>
      <TouchableOpacity
        style={tw.style("bg-white m-5 px-10 py-0 rounded-full mt-20")}
        onPress={() => {
          navigation.goBack();
          navigation.navigate("Chat");
        }}
      >
        <Text style={tw.style("text-center")}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;
