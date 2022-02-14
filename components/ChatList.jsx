import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import ChatRow from "./ChatRow";
const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("userMatched", "array-contains", user.uid)
        ),
        snapshot =>
          setMatches(
            snapshot?.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          )
      ),
    [user]
  );

  return matches.length > 0 ? (
    <FlatList
      style={tw.style("h-full")}
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw.style("p-5")}>
      <Text style={tw.style("text-center text-lg")}>No matches</Text>
    </View>
  );
};

export default ChatList;
