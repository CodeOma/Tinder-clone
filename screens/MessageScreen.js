import {
  View,
  Text,
  KeyboardAvoidingView,
  PlatformColor,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  TextInput,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { useRoute } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        snapshot => {
          setMessages(
            snapshot.docs?.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),

    [matchDetails, db]
  );

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput("");
  };
  return (
    <SafeAreaView style={tw.style("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw.style("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback>
          <FlatList
            inverted={-1}
            data={messages}
            style={tw.style("pl-4")}
            keyExtractor={item => item.id}
            renderItem={({ item: message }) =>
              message.userId == user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View
        style={tw.style(
          "flex-row justify-between bg-white  items-center border-t border-gray-300 px-5 py-2 "
        )}
      >
        <TextInput
          style={tw.style("h-10 text-lg flex-1")}
          placeholder="Send Message..."
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          value={input}
        />
        <Button title="Send" onPress={sendMessage} color="#FF5864" />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
