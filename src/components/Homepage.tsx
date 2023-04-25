import React, { useContext, useMemo, useState } from "react";
import { AuthContext, logOut } from "../firebase/AuthFirebase";
import SignIn from "./SignIn";
import {
  Box,
  IconButton,
  Button,
  Container,
  Flex,
  CircularProgress,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useNavigate, Link as ReachLink } from "react-router-dom";
import { FirestoreContext } from "../firebase/Firestore";
import {
  CategoryTypes,
  PriorityTypes,
  iRetrievedTask,
  priorityColors,
} from "../utils/interfaces";
import { ChakraContainer, CircleIcon } from "../utils/utils";
import TaskModal from "./TaskModal";
import TasksContainer from "./TasksContainer";
import { AddIcon } from "@chakra-ui/icons";
export default function Homepage() {
  const [modal, toggleModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<iRetrievedTask>();

  const { userID, logged } = useContext(AuthContext);
  const { retrievedTasks } = useContext(FirestoreContext);
  const [priorityFilter, setPriorityFilter] = useState<
    "High" | "Middle" | "Low" | undefined
  >();
  const [typeTasks, setTypeTasks] = useState<CategoryTypes>("All");
  const navigate = useNavigate();
  const handleCategoryFilter = (cat: CategoryTypes) => {
    setTypeTasks(cat);
  };

  const typeFilteredTasks = useMemo(() => {
    return typeTasks === "All"
      ? retrievedTasks
      : retrievedTasks?.filter((task) =>
          task.data.categories.includes(typeTasks)
        );
  }, [retrievedTasks, typeTasks]);

  const priorityFilteredTasks = useMemo(() => {
    return !priorityFilter
      ? typeFilteredTasks
      : typeFilteredTasks?.filter(
          (task) => task.data.priority === priorityFilter
        );
  }, [typeFilteredTasks, priorityFilter]);

  const priorityValues = useMemo(() => {
    let count = { high: 0, middle: 0, low: 0 };
    retrievedTasks?.forEach((task) =>
      task.data.priority === "High"
        ? count.high++
        : task.data.priority === "Middle"
        ? count.middle++
        : count.low++
    );
    if (retrievedTasks?.length) {
      const length = retrievedTasks?.length;
      return {
        high: (count.high * 100) / length,
        middle: (count.middle * 100) / length,
        low: (count.low * 100) / length,
      };
    }
  }, [retrievedTasks]);
  return (
    <Box
      width={"100vw"}
      h="100%"
      minH={"100svh"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={logged ? "center" : "flex-start"}
    >
      <ChakraContainer
        id="homepage-container"
        px={0}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={logged ? "flex-start" : "center"}
        minHeight="300px"
        height={logged ? "100%" : "30%"}
        width={logged ? "100%" : "60%"}
        // @ts-ignore no problem in operation, although type error appears.

        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        {!logged ? (
          <SignIn />
        ) : (
          <Container
            as="main"
            id="homepage-main"
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
            {!!selectedTask && modal && (
              <TaskModal
                task={selectedTask}
                toggleModal={toggleModal}
                setSelectedTask={setSelectedTask}
              />
            )}
            <Flex width={"100%"} justify={"space-between"} mb={4} bg="gray.200">
              <IconButton
                fontSize={32}
                fontWeight={800}
                backgroundColor={"#fefefe"}
                border={"2px solid #222"}
                borderColor={"gray.600"}
                padding={0}
                onClick={() => navigate("/newTask")}
                aria-label="Add new task"
                icon={<AddIcon color="gray.600" boxSize={4} />}
              ></IconButton>
              <Button bg="gray.600" colorScheme="blackAlpha" onClick={() => logOut()}>Log Out</Button>
            </Flex>
            <Box>
              <Flex
                m="0 auto"
                my={4}
                justify={"space-between"}
                align={"center"}
                w={{ base: "100%", md: "80%" }}
              >
                <Box>
                  {["All", "Work", "Study", "Personal"].map(
                    (catType, i, arr) => (
                      <React.Fragment key={catType}>
                        <Button
                          variant="link"
                          mx={1}
                          py={1}
                          minW={"fit-content"}
                          name={catType}
                          borderRadius={0}
                          color={
                            typeTasks === catType
                              ? "#hsl(214, 26%, 58%)"
                              : "#718096"
                          }
                          borderTop={
                            typeTasks === catType ? "1px solid #718096" : ""
                          }
                          borderBottom={
                            typeTasks === catType ? "1px solid #718096" : ""
                          }
                          onClick={(e) =>
                            handleCategoryFilter(catType as CategoryTypes)
                          }
                        >
                          {catType}
                        </Button>
                        {i < arr.length - 1 && "/"}
                      </React.Fragment>
                    )
                  )}
                </Box>
                <Flex>
                  {["Low", "Middle", "High"].map((pr) => (
                    <Box
                      key={pr}
                      typeof="button"
                      width={4}
                      ml={2}
                      height={4}
                      bg={
                        pr === "High"
                          ? priorityColors.HIGH
                          : pr === "Middle"
                          ? priorityColors.MIDDLE
                          : priorityColors.LOW
                      }
                      outline={priorityFilter === pr ? "2px solid #0d0d0d" : ""}
                      outlineOffset={2}
                      cursor={"pointer"}
                      borderRadius={2}
                      onClick={() =>
                        setPriorityFilter((prev) =>
                          prev === pr ? undefined : (pr as PriorityTypes)
                        )
                      }
                    ></Box>
                  ))}
                </Flex>
              </Flex>
              <TasksContainer
                priorityFilter={priorityFilter}
                tasks={priorityFilteredTasks}
                typeTasks={typeTasks}
                toggleModal={toggleModal}
                setSelectedTask={setSelectedTask}
              />
            </Box>
            {priorityValues?.high && (
              <Flex
                margin="2rem auto"
                h="200px"
                maxW={"400px"}
                w={"100%"}
                position={"relative"}
                align={"center"}
                justify={"space-around"}
              >
                <Box position="relative" w="200px">
                  <Tooltip hasArrow color="gray.800" bg={"hsla(5, 49%, 80%, 1)"} placement="right" label={`High Priority: ${priorityValues.high.toFixed(2)}%`}>
                    <CircularProgress
                      value={priorityValues?.high}
                      thickness="4px"
                      position={"absolute"}
                      size={"200px"}
                      left={"50%"}
                      top={"50%"}
                      color={priorityColors.HIGH}
                      transform={`translate(-50%,-50%) rotate(-${priorityValues?.high.toFixed(
                        2
                      )}deg)`}
                    />
                  </Tooltip>
                  <Tooltip hasArrow color="gray.800" bg={"hsla(29, 70%, 80%, 1)"} placement="right"
                    label={`Middle Priority: ${priorityValues.middle.toFixed(
                      2
                    )}%`}
                  >
                    <CircularProgress
                      value={priorityValues?.middle}
                      thickness="4px"
                      position={"absolute"}
                      color={priorityColors.MIDDLE}
                      size={"150px"}
                      left={"50%"}
                      top={"50%"}
                      transform={`translate(-50%,-50%) rotate(${
                        180 - priorityValues?.middle
                      }deg)`}
                    />
                  </Tooltip>

                  <Tooltip hasArrow color="gray.800" bg={"hsl(56, 90%, 80%)"} placement="right"
                  
                    label={`Low Priority: ${priorityValues.low.toFixed(2)}%`}
                  >
                    <CircularProgress
                      value={priorityValues?.low}
                      thickness="4px"
                      position={"absolute"}
                      size={"100px"}
                      left={"50%"}
                      top={"50%"}
                      color={priorityColors.LOW}
                      transform={`translate(-50%,-50%) rotate(-${priorityValues?.low}deg)`}
                    />
                  </Tooltip>
                </Box>
                <Box id="priority-graphic-text">
                  <Text><CircleIcon color={priorityColors.HIGH} />High: {priorityValues.high.toFixed(2)}</Text>
                  <Text><CircleIcon color={priorityColors.MIDDLE} />Middle:{priorityValues.middle.toFixed(2)}</Text>
                  <Text><CircleIcon color={priorityColors.LOW} />Low:{priorityValues.low.toFixed(2)}</Text>
                </Box>
              </Flex>
            )}
          </Container>
        )}
      </ChakraContainer>
    </Box>
  );
}
