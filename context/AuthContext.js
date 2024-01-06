"use client";

import { createContext, useContext, useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { profileColors } from "@/utils/constants";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const randomColorIndex = Math.floor(Math.random() * profileColors.length);

  const signUpWithEmailPassword = async (email, password, displayName) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[randomColorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, {
        displayName,
      });
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const signInWithEmailPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed In Successfully");
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The code here will run after the user has been signed in successfully.
    } catch (error) {
      // Handle any errors that occur during the sign-in process.
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The code here will run after the user has been signed in successfully.
    } catch (error) {
      // Handle any errors that occur during the sign-in process.
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      clear();
      console.log("Signed Out Successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // changed

  // const currentUserUid = currentUser?.value.mapValue.fields.uid.stringValue;
  const currentUserUid = currentUser?.uid;

  const clear = async () => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUserUid), {
          isOnline: false,
        });
      }

      setCurrentUser(null);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const authStateChanged = async (user) => {
    setLoading(true);
    if (!user) {
      clear();
      return;
    }

    const userDocExist = await getDoc(doc(db, "users", user.uid));
    if (userDocExist.exists()) {
      await updateDoc(doc(db, "users", user.uid), {
        isOnline: true,
      });
    }

    console.log(user.uid);

    const userDoc = await getDoc(doc(db, "users", user.uid));

    setCurrentUser(userDoc.data());
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  const contextValue = {
    currentUser,
    loading,
    setLoading,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signInWithGoogle,
    signInWithFacebook,
    signOutUser,
    resetPassword,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
