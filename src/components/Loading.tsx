import { Box, Button, Flex, Image } from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader"

export default function Loading() {
  return (
    <Flex 
    minHeight={"300px"}
    direction={"column"} align="center">
      <BeatLoader size={20} color='black' />

    </Flex>
  );
}
