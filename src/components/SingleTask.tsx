import {
  Box,
  Container,
  Divider,
  Heading,
  LinkBox,
  Link,
  OrderedList,
  ListItem,
  Progress,
  Text,
  Flex,
  HStack,
  Spacer,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  iRetrievedTask,
  iSubmittedTaskData,
  priorityColors,
} from "../utils/interfaces";
import { Link as ReachLink, useNavigate, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { dateFormatter, superDesatColor, prioColor } from "../utils/utils";

import DeleteModal from "./DeleteModal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FirestoreContext } from "../firebase/Firestore";
import Loading from "./Loading";
import AccomplishedModal from "./AccomplishedModal";
import { AuthContext } from "../firebase/AuthFirebase";

export default function SingleTask() {
  const [task, setTask] = useState<iSubmittedTaskData>();
  const { id } = useParams();
  const [timePercentage, setTimePercentage] = useState<number>(0);
  const navigate = useNavigate();
  const { getNewTasksLists, oneTimeSession, retrievedTasks } = useContext(FirestoreContext);
  const { userID } = useContext(AuthContext);
  useEffect(() => {
    if (id && !!userID?.userUID) {
      async function getPost(id: string) {
        try {
          const snapPost = await getDoc(
            doc(db, `user/${userID?.userUID}/tasks`, id)
          );
          const taskDoc = snapPost.data();
          setTask(taskDoc as iSubmittedTaskData);
        } catch (e) {
          setTask(undefined);
          console.log("error", e);
        }
      }
      getPost(id);
    }else if(id && retrievedTasks && oneTimeSession){
      const localTask = retrievedTasks.find(t=>t.id===id)
      localTask ? setTask(localTask.data) : console.log("error, no task", localTask)
    }
  }, []);
  const handleDeleteTask = async () => {
    if (!!id && !!userID?.userUID) {
      deleteDoc(doc(db, `user/${userID?.userUID}/tasks`, id)).then(() => {
        getNewTasksLists();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    }else if(id && retrievedTasks?.length && oneTimeSession){
      const filteredTasks = retrievedTasks.filter(t=>t.id!==id)
      localStorage.setItem("tasks", JSON.stringify(filteredTasks))
      getNewTasksLists();
        setTimeout(() => {
          navigate("/");
        }, 1000);
    }
  };

  const progressValue: number = !!task
    ? task.progress === "Not Started"
      ? 0
      : task.progress === "Initial"
      ? 25
      : task.progress === "Intermediate"
      ? 50
      : task.progress === "Advanced"
      ? 75
      : "Finished"
      ? 100
      : 0
    : 0;

  const prioDesatColor = task?.accomplished
    ? priorityColors.desatACCOMPLISHED
    : task?.priority === "High"
    ? priorityColors.desatHIGH
    : task?.priority === "Middle"
    ? priorityColors.desatMIDDLE
    : priorityColors.desatLOW;
  const progressColor =
    task?.progress === "Finished"
      ? "green.900"
      : task?.progress === "Advanced"
      ? "green.700"
      : task?.progress === "Intermediate"
      ? "orange.700"
      : "red.800";

  useEffect(() => {
    if (task) {
      const timeAvailable =
        new Date(
          task.deadline.replace(/(\d+)-(\d+)-(\d+)/, "$1-$2-$3")
        ).getTime() -
        new Date(
          task.startDate.replace(/(\d+)-(\d+)-(\d+)/, "$1-$2-$3")
        ).getTime();

      const timeUsed =
        new Date().getTime() -
        new Date(
          task.startDate.replace(/(\d+)-(\d+)-(\d+)/, "$1-$2-$3")
        ).getTime();

      setTimePercentage((100 * timeUsed) / timeAvailable);
    }
  }, [task]);
  return (
    <Container
      w="100%"
      minH="100svh"
      h="100%"
      maxW={"600px"}
      p={6}
      bg={
        task?.accomplished !== undefined
          ? superDesatColor(task?.accomplished, task?.priority)
          : ""
      }
    >
      {!task ? (
        <Loading />
      ) : (
        <Flex
          minH="calc(100svh - 3rem)"
          h={"fit-content"}
          id="box"
          flexDirection={"column"}
        >
          <Flex justify={"space-between"}>
            <Link mb={2} as={ReachLink} to="/">
              <ArrowBackIcon boxSize={6} />
            </Link>
            {!!task.accomplished && (
              <Text
                id="accomplished-text"
                borderBottom={"1px solid  hsl(120, 97%, 06%)"}
                color={"green.900"}
                mb={2}
              >
                Accomplished on {dateFormatter(task.accomplishedDate)}
              </Text>
            )}

            <Box></Box>
          </Flex>
          <Heading
            as={"h1"}
            fontSize={"2.5rem"}
            textAlign={"end"}
            w={{ base: "100%", lg: "90%" }}
            margin={"0 auto"}
          >
            {task.title}
          </Heading>
          <Divider colorScheme="blackAlpha" />
          <Text
            p={3}
            my={6}
            mx="auto"
            w="90%"
            minH={"6rem"}
            borderTop={0}
            borderRadius={"0 0 0.25rem 0.25rem"}
            boxShadow={"inner"}
          >
            {task.description}
          </Text>
          <Flex justify={"space-between"} w="100%" p={0} mb={4}>
            <HStack
              id="priority-box-task"
              w="fit-content"
              borderRadius={4}
              p={2}
              bg={prioDesatColor}
              border={`3px solid ${prioColor(
                task.accomplished,
                task.priority
              )}`}
              color={"#0d0d0d"}
            >
              <Text>Priority:</Text>
              <Text>{task.priority}</Text>
            </HStack>
            {!task.accomplished && !!id && (
              <AccomplishedModal task={task} id={id} />
            )}
          </Flex>
          <Flex
            direction={"column"}
            id="progress-box-task"
            my={2}
            py={4}
            minW={"90%"}
            borderRadius={4}
            boxShadow={"md"}
          >
            <Progress
              colorScheme={
                task?.progress === "Finished"
                  ? "green"
                  : task?.progress === "Advanced"
                  ? "green"
                  : task?.progress === "Intermediate"
                  ? "orange"
                  : "red"
              }
              size={"sm"}
              borderRadius={2}
              value={progressValue}
              m={"0 auto"}
              w={"90%"}
            ></Progress>
            <Text
              m={"0.25rem 0.5rem"}
              color={progressColor}
              alignSelf={"end"}
              mr="7.5%"
            >
              {task.progress}
            </Text>

            {task.progressDesc.length > 0 && (
              <Box py={2} ml="7.5%">
                <Text id="steps-title-single-task" fontSize={"1.1rem"}>
                  Steps made:
                </Text>
                <OrderedList>
                  {task.progressDesc.map((step) => (
                    <ListItem key={step}>{step}</ListItem>
                  ))}
                </OrderedList>
              </Box>
            )}
          </Flex>
          {!!task.deadline && (
            <Flex
              direction={"column"}
              align={"center"}
              id="work-period-box-task"
              my={4}
            >
              <Text id="worktime-title-single-task">Work period:</Text>
              <Progress
                colorScheme={timePercentage < 50 ? "green" : "red"}
                size={"xs"}
                w="60%"
                borderRadius={4}
                value={timePercentage}
              ></Progress>
              <Text>
                {dateFormatter(task.startDate)} {"->"}{" "}
                {dateFormatter(task.deadline)}
              </Text>
            </Flex>
          )}
          {!!task.updateDate && (
            <Text mt={8} fontSize={"0.8rem"} color={"gray.500"}>
              (Latest update: {dateFormatter(task.updateDate)})
            </Text>
          )}
          <Spacer></Spacer>

          <Divider my={2} />
          <Flex>
            <DeleteModal
              handleDeleteTask={handleDeleteTask}
              postTitle={task.title}
            />
            <Spacer></Spacer>
            <Button
              as={ReachLink}
              to={`/update/${id}`}
              bg="green.700"
              color="#fefefe"
            >
              Update
            </Button>
          </Flex>

          <Spacer></Spacer>
          <Box mt={10}>
            <Flex
              marginTop={"auto"}
              id="categories-box-task"
              float={"left"}
              minH={"2rem"}
              align={"flex-end"}
              mt={1}
            >
              <Text id="categories-title">Categories:</Text>
              {task.categories.map((cat) => (
                <Link
                  key={cat}
                  mx={3}
                  as={ReachLink}
                  textDecoration={"underline"}
                  _hover={{
                    outline: `1px solid ${prioColor(
                      task.accomplished,
                      task.priority
                    )}`,
                    outlineOffset: "0.25rem",
                  }}
                >
                  {cat}
                </Link>
              ))}
            </Flex>
            {task.tags.length > 0 && (
              <Flex
                mb={3}
                flexWrap={"wrap"}
                direction={"row-reverse"}
                minH={"2rem"}
              >
                {task.tags.map((tag, i) => (
                  <Link
                    key={tag + i}
                    as={ReachLink}
                    _hover={{
                      backgroundColor: "gray.500",
                      color: "#fefefe",
                      borderColor: "gray.500",
                    }}
                    type="button"
                    colorScheme="gray"
                    fontSize={"sm"}
                    fontWeight={500}
                    p={1}
                    ml={2}
                    mt={2}
                    bg={"gray.700"}
                    borderRadius={5}
                    color={"#fefefe"}
                    to={`/${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </Flex>
            )}
          </Box>
        </Flex>
      )}
    </Container>
  );
}
