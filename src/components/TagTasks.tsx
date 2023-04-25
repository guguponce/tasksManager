import React, { useContext, useMemo, useState } from "react";
import { Link as ReachLink } from "react-router-dom";
import { FirestoreContext } from "../firebase/Firestore";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Loading from "./Loading";
import TasksContainer from "./TasksContainer";
import TaskModal from "./TaskModal";
import { iRetrievedTask } from "../utils/interfaces";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function TagTasks() {
  const [modal, toggleModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<iRetrievedTask>();

  const { tag } = useParams();
  const { retrievedTasks } = useContext(FirestoreContext);

  const tagTasks = useMemo(
    () =>
      retrievedTasks?.length && tag
        ? retrievedTasks.filter((task) => task.data.tags.includes(tag))
        : [],
    [retrievedTasks, tag]
  );

  const relatedTags = useMemo(
    () =>
      tagTasks
        .map((task) => task.data.tags)
        .flat()
        .filter((t) => t !== tag),
    [tagTasks]
  );
  console.log("relatedTags", relatedTags);
  return (
    <Box
      width={"100vw"}
      h="100%"
      minH={"100svh"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Container
        as="main"
        id="homepage-main"
        display={"flex"}
        flexDirection={"column"}
        py={10}
        px={[6]}
        justifySelf={"center"}
        maxW={["1000px"]}
        width="100%"
        height="100%"
        minH={"100svh"}
        borderRadius="2rem"
        boxShadow={"m"}
        backgroundColor={"#fafafa"}
        position={"relative"}
      >
        {!retrievedTasks?.length || !tag ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Link mb={2} as={ReachLink} to="/">
              <ArrowBackIcon boxSize={6} />
            </Link>
            <Heading ml={8} mt={4} mb={8}>
              #{tag}
            </Heading>
            {!!selectedTask && modal && (
              <TaskModal
                task={selectedTask}
                toggleModal={toggleModal}
                setSelectedTask={setSelectedTask}
              />
            )}
            <TasksContainer
              tasks={tagTasks}
              typeTasks="All"
              toggleModal={toggleModal}
              setSelectedTask={setSelectedTask}
              priorityFilter={undefined}
            />
          </React.Fragment>
        )}
        <Spacer />
        {relatedTags.length > 1 && (
          <Box>
            <Text id="related-tags-title" fontSize={"1.5rem"}>Related hashtags :</Text>
            <Flex  mb={3} flexWrap={"wrap"}>
              {relatedTags.map((relTag, i) => (
                <Link
                  as={ReachLink}
                  _hover={{
                    backgroundColor: "red.500",
                    color: "#fefefe",
                    borderColor: "red.500",
                  }}
                  key={relTag + i}
                  type="button"
                  colorScheme="gray"
                  fontSize={"sm"}
                  fontWeight={500}
                  p={1}
                  mr="2"
                  mt={1}
                  borderRadius={5}
                  bg={"gray.500"}
                  color={"#fefefe"}
                  to={`/${relTag}`}
                >
                  #{relTag}
                </Link>
              ))}
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
}
