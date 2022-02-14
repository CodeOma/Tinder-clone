import {
  View,
  Text,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");

  const incompleteForm = !image || !job || !age;
  const navigation = useNavigation();

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch(e => {
        console.log(e);
        alert(e.message);
      });
  };
  return (
    <View style={tw.style("flex-1 items-center pt-20 relative")}>
      <Image
        style={tw.style("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tw.style("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 1: Profile Picture
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={tw.style("text-center text-xl pb-2")}
        placeholder="Enter Picture UrL"
      />
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={text => setJob(text)}
        style={tw.style("text-center text-xl pb-2")}
        placeholder="Enter your Job"
      />
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={text => setAge(text)}
        style={tw.style("text-center text-xl pb-2")}
        placeholder="Enter your Age"
        maxLength={3}
      />
      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompleteForm}
        style={[
          tw.style("w-64 p-3 absolute rounded-xl bottom-10"),
          incompleteForm ? tw.style("bg-gray-400") : tw.style("bg-red-400"),
        ]}
      >
        <Text style={tw.style("text-white text-xl  text-center")}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
