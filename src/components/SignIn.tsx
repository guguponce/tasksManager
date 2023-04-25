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

export default function SignIn() {
  const { signIn, logged, userID } = useContext(AuthContext);
  const [user, setUser] = useState<{
    email: string | null;
    name: string | null;
  }>();

  const handleLogIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const loggedUser = await signIn().then((res) => res);
    loggedUser && setUser(loggedUser);
  };
  useEffect(() => {
    userID?.email && setUser(userID);
  }, [userID]);

  return (
    <Container
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
    >
        <Button _hover={{ display: "block", outline: "1px solid #0d0d0d", transform: "scale(1.01)" }} onClick={handleLogIn}>
          <i className="iIcon googleIcon" /> Log In with your Google Account
        </Button>
    </Container>
  );
}
