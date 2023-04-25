import { auth } from "./firebase";
import {
  Auth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";

const googleProvider = new GoogleAuthProvider();

interface iAuthContext {
  signIn: () => Promise<{
    email: string | null;
    name: string | null;
    userUID: string | null;
  } | void>;
  logged: boolean;
  userID?: {
    email: string | null;
    name: string | null;
    userUID: string | null;
  };
  logOut: () => void;
}
export const signIn = (): Promise<{
  email: string | null;
  name: string | null;
  userUID: string | null
} | void> => {
  return signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      return { email: user.email, name: user.displayName, userUID: user.uid };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      const email = error.customData.email;
      console.log("We had problem logging in with: " + email);
    });
};

export const logOut = () => {
  signOut(auth).catch((error) => {
    console.log(error.message);
    console.log("We had problem logging in with: " + error.customData.email);
  });
};

export const AuthContext = createContext<iAuthContext>({
  signIn,
  logged: false,
  logOut,
});

export default function AuthProvider({ children }: { children: JSX.Element }) {
  const [logged, toggleLogged] = useState<boolean>(false);
  const [userID, setUserID] = useState<{
    email: string | null;
    name: string | null;
    userUID: string | null;
  }>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        const userName = user.displayName;
        const userUID = user.uid;
        toggleLogged(true);
        userEmail && setUserID({ email: userEmail, name: userName, userUID });
        // ...
      } else {
        toggleLogged(false);
        setUserID(undefined);
      }
    });
  }, []);
  return (
    <AuthContext.Provider value={{ signIn, logOut, logged, userID }}>
      {children}
    </AuthContext.Provider>
  );
}
