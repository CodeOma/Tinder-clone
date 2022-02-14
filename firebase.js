import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  //removed, too lazy to add config to .env at this moment
};

let app;
if (!app) {
  app = initializeApp(firebaseConfig);
}
const db = getFirestore();
const auth = getAuth();

export { db, auth };
