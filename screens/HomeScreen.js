import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  onSnapshot,
  doc,
  collection,
  setDoc,
  query,
  where,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), snapshot => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );
  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then(snapshot => {
        return snapshot.docs.map(doc => doc.id);
      });
      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then(snapshot => {
        return snapshot.docs.map(doc => doc.id);
      });
      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        snapshot => {
          setProfiles(
            snapshot.docs
              ?.filter(doc => doc.id != user.uid)
              .map(doc => {
                return { id: doc.id, ...doc.data() };
              })
          );
        }
      );
    };

    fetchCards();
    console.log(profiles);
    return unsub;
  }, []);

  const swipeLeft = index => {
    if (!profiles[index]) return;

    const userSwiped = profiles[index];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async index => {
    try {
      if (!profiles[index]) return;
      const userSwiped = profiles[index];
      const loggedInProfile = await (
        await getDoc(doc(db, "users", user.uid))
      ).data();

      getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
        documentSnapshot => {
          if (documentSnapshot.exists()) {
            //users matched
            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );
            setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
              users: {
                [user.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              userMatched: [user.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            });
            navigation.navigate("Match", { loggedInProfile, userSwiped });
          } else {
            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={tw.style("flex-1")}>
      <View style={tw.style("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw.style("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw.style("h-14 w-14")}
            source={{
              uri: "https://pbs.twimg.com/profile_images/3574985406/db987e1c510e16a3a8e129c9d5a41b24_400x400.png",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={tw.style("flex-1 mt-3")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          onSwipedLeft={index => {
            swipeLeft(index);
          }}
          onSwipedRight={index => {
            swipeRight(index);
          }}
          animateCardOpacity
          backgroundColor="#4FD0E9"
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "YUP",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={card =>
            card ? (
              <View style={tw.style("relative bg-white h-3/4 rounded-xl")}>
                <Text>{card.firstName}</Text>
                <Image
                  style={tw.style("absolute top-0 h-full w-full rounded-xl")}
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/3574985406/db987e1c510e16a3a8e129c9d5a41b24_400x400.png",
                  }}
                />
                <View
                  style={[
                    tw.style(
                      "absolute bg-white w-full flex-row h-20 bottom-0 justify-between items-center px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw.style("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw.style("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={tw.style(
                  "relative bg-white h-3/4 rounded-xl justify-center items-center"
                )}
              >
                <Text style={tw.style("font-bold pb-5")}>No more</Text>
              </View>
            )
          }
        />
      </View>
      <View style={tw.style("flex flex-row justify-evenly mb-2")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
