import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD38Wz1qcoQiRLQKLJDUF7HuO3VymJas0",
  authDomain: "chat-app-f8827.firebaseapp.com",
  projectId: "chat-app-f8827",
  storageBucket: "chat-app-f8827.appspot.com",
  messagingSenderId: "858933358797",
  appId: "1:858933358797:web:31dca34d66d19cc2ac7984",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
