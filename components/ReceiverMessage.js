import { View, Text, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const ReceiverMessage = ({ message }) => {
  return (
    <View
      style={[
        tw.style(
          "bg-purple-600 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"
        ),
        { alignSelf: "flex-start" },
      ]}
    >
      <Image
        style={tw.style("h-12 w-12 rounded-full absolute top-0 -left-14")}
        source={{ uri: message.photoURL }}
      />
      <Text style={tw.style("text-white")}>{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;
