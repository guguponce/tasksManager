import React from "react";
import { ChakraList, desatColor, prioColor, superDesatColor } from "../utils/utils";
import {
  LinkBox,
  Box,
  Heading,
  LinkOverlay,
  Text,
  Link,
  ListItem,
  Button,
  Progress,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate, Link as ReachLink } from "react-router-dom";
import {
  iRetrievedTask,
  iSubmittedTaskData,
  priorityColors,
} from "../utils/interfaces";
import { borColor } from "../utils/utils";

interface Props {
  task: iRetrievedTask;
  i: number;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<iRetrievedTask | undefined>
  >;
}

export default function TaskBox({
  task,
  i,
  toggleModal,
  setSelectedTask,
}: Props) {
  const { accomplished, priority, progress, tags, title, description, deadline } =
    task.data;
  return (
    <ChakraList
    py={2}
      animate={{
        opacity: [0, 1],
      }}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        delay: 0.25,
        duration: 0.75 + i / 2,
        ease: "easeInOut",
      }}
      key={task.id}
    >
      <LinkBox
        as="article"
        display={"flex"}
        flexDirection={"column"}
        maxW={{ base: "175px", xl: "200px" }}
        minH={{ base: "200px", xl: "200px" }}
        p="5"
        pb="2"
        borderWidth="1px"
        rounded="md"
        border={task.data.accomplished ? `3px solid ${priorityColors.ACCOMPLISHED}`: ""}
        bg={desatColor(task.data.accomplished, task.data.priority)}
      >
        <Heading size="md" my="2">
          {deadline && (
            <Text
              color="#555"
              fontSize={10}
              position={"absolute"}
              top={2}
              right={2}
              display={"flex"}
              alignItems={"center"}
            >
              <i className="iIcon deadlineIcon" />
            </Text>
          )}
          <LinkOverlay
            onClick={() => {
              setSelectedTask(task);
              toggleModal(true);
            }}
          >
            {title}
          </LinkOverlay>
        </Heading>

        {description.substring(0, 50)}
        {description.length > 50 && "..."}
        <Text></Text>
        <Spacer />
        <Flex mt={5} mb={3} flexWrap={"wrap"}>
          {tags.slice(0, 2).map((tag, i) => (
            <Link
              as={ReachLink}
              _hover={{
                backgroundColor: desatColor(accomplished, priority),
                // color: "#fefefe",
              }}
              key={tag + i}
              type="button"
              colorScheme="gray"
              fontSize={"sm"}
              fontWeight={500}
              p={1}
              mr="2"
              mt={1}
              borderRadius={5}
              bg={superDesatColor(accomplished, priority)}
              color={"gray.800"}
              to={`/${tag}`}
            >
              #{tag}
            </Link>
          ))}
          {tags.length > 2 && (
            <span style={{ alignSelf: "flex-end" }}>...</span>
          )}
        </Flex>
        <Progress
          colorScheme={accomplished
          ? "green"
          : priority === "High"
          ? "red"
          : priority === "Middle"
          ? "orange"
          : "yellow "}
          size={"sm"}
          border={"1px solid #2D374"}
          borderRadius={4}
          value={
            progress === "Not Started"
              ? 0
              : progress === "Initial"
              ? 25
              : progress === "Intermediate"
              ? 50
              : progress === "Advanced"
              ? 75
              : "Finished"
              ? 100
              : 0
          }
        ></Progress>
      </LinkBox>
    </ChakraList>
  );
}
