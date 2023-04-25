import {
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { ArrowForwardIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Link as ReachLink } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import {
  iRetrievedTask,
  iSubmittedTaskData,
  priorityColors,
} from "../utils/interfaces";
import { dateFormatter, desatColor, prioColor, superDesatColor } from "../utils/utils";
export default function Modal({
  toggleModal,
  setSelectedTask,
  task,
}: {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  task: iRetrievedTask;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<undefined | iRetrievedTask>
  >;
}) {
  const { accomplished,progress, title, description, deadline, priority, tags } = task.data;

  const modalCont = useRef<HTMLDivElement | null>(null);
  const modalBox = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      !modalBox.current?.contains(event.target as Node) && closeModal();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeModal()
    );
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);
  function closeModal() {
    setSelectedTask(undefined);
    toggleModal(false);
  }

  return (
    <Box key="modal" ref={modalCont} id="modal-container">
      <Box
        bg={superDesatColor(task.data.accomplished, priority)}
        ref={modalBox}
        id={"task-modal"}
        className="modal-box"
        p={{ base: 4, xl: 8 }}
        animate={{
          opacity: [0, 1],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          delay: 0.25,
          duration: 0.75,
          ease: "easeInOut",
        }}
      >
        <Heading as={"h1"} fontSize={"2.5rem"} color="gray.700">
          {title}
        </Heading>
        <Divider colorScheme="gray" />
        <Box
          height={"7rem"}
          w={{ base: "100%", xl: "80%" }}
          p={3}
          bg={desatColor(accomplished, priority)}
          position={"relative"}
          overflow={"hidden"}
          
          border={`1px solid ${prioColor(accomplished, priority)}`}
        >
          <Box
            height={"1.4rem"}
            w="calc(100% - 1.5rem)"
            borderBottom={"1px solid white"}
            position={"absolute"}
            transform={"translate(0,50%)"}
            top={0}
          ></Box>{" "}
          <Box
            height={"1.4rem"}
            w="calc(100% - 1.5rem)"
            borderBottom={"1px solid white"}
            position={"absolute"}
            transform={"translate(0,50%)"}
            top={"1.4rem"}
          ></Box>
          <Box
            height={"1.4rem"}
            w="calc(100% - 1.5rem)"
            borderBottom={"1px solid white"}
            position={"absolute"}
            transform={"translate(0,50%)"}
            top={"2.8rem"}
          ></Box>
          <Box
            height={"1.4rem"}
            w="calc(100% - 1.5rem)"
            borderBottom={"1px solid white"}
            position={"absolute"}
            transform={"translate(0,50%)"}
            top={"4.2rem"}
          ></Box>
          <Text
            mb={6}
            mx={1}
            minH={"4rem"}
            minW={{ base: "100%", xl: "80%" }}
            borderTop={0}
            lineHeight={"1.4rem"}
            fontSize={"1rem"}
            color={"gray.900"}
          >
            {description.substring(0, 150)}
            {description.length > 150 && "..."}
          </Text>
        </Box>
        {deadline && (
          <HStack
            alignSelf={"flex-start"}
            id="categories-box-task"
            float={"left"}
            minH={"2rem"}
            mt={1}
            color={prioColor(accomplished, priority)}
          >
            <i className="iIcon deadlineIcon"></i>
            <Text id="categories-title">Deadline:</Text>
            <Text>{dateFormatter(deadline)}</Text>
          </HStack>
        )}
        <Text my={4} id="progress-task-modal"><span>Stage:</span> {task.data.progress}</Text>
        {/* <Flex mt={5} mb={3} w={{base: "90%",lg:"60%"}} justify={"center"} flexWrap={"wrap"}>
          {tags.map((tag, i) => (
            <Link
              as={ReachLink}
              _hover={{
                backgroundColor: desatColor(task.data.accomplished, task.data.priority),
              }}
              key={tag + i}
              type="button"
              colorScheme="gray"
              fontSize={"sm"}
              fontWeight={500}
              py={1}
              px={2}
              mr="2"
              mt={1}
              border={0}
              borderRadius={5}
              bg={"gray.600"}
              color={"#fefefe"}
              to={`/${tag}`}
            >
              #{tag}
            </Link>
          ))}
        </Flex> */}
        <Link
          display={"flex"}
          alignItems={"center"}
          id="more-details-link"
          as={ReachLink}
          alignSelf={"flex-end"}
          to={`/task/${task.id}`}
          textDecoration={"underline"}
          color="gray.700"
        >
          <SmallAddIcon /> Details <ArrowForwardIcon id="forward-icon" ml={2} />
        </Link>
      </Box>
    </Box>
  );
}
