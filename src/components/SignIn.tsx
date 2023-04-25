import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/AuthFirebase";
import { Link as ReachLink } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { FirestoreContext } from "../firebase/Firestore";

export default function SignIn() {
  const { signIn, logged, userID } = useContext(AuthContext);
  const { logInOneTimeSession, oneTimeSession } = useContext(FirestoreContext);
  const [user, setUser] = useState<
    | {
        email: string | null;
        name: string | null;
      }
    | "localSession"
  >();

  const handleLogIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const loggedUser = await signIn().then((res) => res);
    loggedUser && setUser(loggedUser);
  };

  useEffect(() => {
    userID?.email && setUser(userID);
    oneTimeSession && setUser("localSession");
  }, [userID, oneTimeSession]);

  return (
    <Flex
      as="main"
      id="sign-in-main"
      py={10}
      margin="0"
      px={[6]}
      justifySelf={"center"}
      width="fit-content"
      borderRadius="2rem"
      boxShadow={"m"}
      backgroundColor={"#fafafa"}
      direction={"column"}
      align={"center"}
      justify={"center"}
    >
      <Button
        _hover={{ outline: "1px solid #0d0d0d", transform: "scale(1.01)" }}
        onClick={handleLogIn}
        my={2}
      >
        <i className="iIcon googleIcon" /> Log In with your Google Account
      </Button>
      <Button
        _hover={{ outline: "1px solid #0d0d0d", transform: "scale(1.01)" }}
        onClick={logInOneTimeSession}
        my={2}
      >
        One time session
      </Button>
    </Flex>
  );
}
