import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-react-native-classnames";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails.users, user.uid]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        ),
        snapshot => setLastMessage(snapshot.docs[0].data().message)
      ),
    [matchDetails, db]
  );

  return (
    <TouchableOpacity
      style={tw.style(
        "flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"
      )}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <Image
        style={tw.style("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View>
        <Text style={tw.style("text-lg font-semibold")}>
          {matchedUserInfo?.displayName}
        </Text>

        <Text style={tw.style("text-sm text-gray-500 ")}>
          {lastMessage || "Say Hi!"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
