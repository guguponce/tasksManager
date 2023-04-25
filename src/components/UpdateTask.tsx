import { redirect, useNavigate, useParams } from "react-router-dom";
import {
  useToast,
  Box,
  Button,
  Checkbox,
  Container,
  Icon,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
  Spacer,
  OrderedList,
  ListItem,
  Link,
  Flex,
  Image,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FirestoreContext } from "../firebase/Firestore";
import { iSubmittedTaskData, priorityColors } from "../utils/interfaces";
import { db } from "../firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
  SpinnerIcon,
} from "@chakra-ui/icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loading from "./Loading";
import { getCurrentDate, getCurrentTime } from "../utils/utils";
import { AuthContext } from "../firebase/AuthFirebase";

export default function UpdateTask() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [updatingTask, setUpdatingTask] = useState<iSubmittedTaskData>();

  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [progressDescriptions, setProgressDescriptions] = useState<string[]>(
    []
  );
  const [priority, setPriority] = useState<string>("Low");
  const [accomplished, setAccomplished] = useState<boolean>(false);
  const [accomplishedDate, setAccomplishedDate] = useState<string>("");
  const [updateDate, setUpdateDate] = useState<string>("");

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const progressRef = useRef<HTMLSelectElement>(null);
  const creationRef = useRef<HTMLInputElement>(null);
  const progressDescRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { userID } = useContext(AuthContext);

  const { getNewTasksLists } = useContext(FirestoreContext);

  const showWarning = (title: string) => {
    toast({
      title,
      status: "error",
      isClosable: true,
      position: "top",
      duration: 5000,
    });
  };

  //   gets data from updating task
  useEffect(() => {
    if (id && !!userID?.userUID) {
      async function getTask(id: string) {
        try {
          const snapTask = await getDoc(doc(db, `user/${userID?.userUID}/tasks`, id));
          const task = snapTask.data();

          setUpdatingTask(task as iSubmittedTaskData);
        } catch (e) {
          console.log("error", e);
        }
      }
      getTask(id);
    }
  }, []);

  // pass data from Post to Form
  useEffect(() => {
    if (!!updatingTask) {
      titleRef.current!.value = updatingTask.title;
      descriptionRef.current!.value = updatingTask.description;
      deadlineRef.current!.value = updatingTask.deadline;
      setPriority(updatingTask.priority);
      progressRef.current!.value = updatingTask.progress;
      creationRef.current!.value = updatingTask.startDate;
      setProgressDescriptions(updatingTask.progressDesc);
      setUpdateDate(updatingTask.updateDate);
      setAccomplished(updatingTask.accomplished);
      setAccomplishedDate(updatingTask.accomplishedDate);
      // categories,
      setCategories([...updatingTask.categories]);
      // tags,
      setTags([...updatingTask.tags]);
      // link: links,
      setLinks([...(updatingTask.links as string[])]);
    }
  }, [updatingTask]);

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (tagRef.current!.value !== "") {
      tagRef.current!.focus();
      showWarning("Please add the written Tag or erase it");
    } else if (linkRef.current!.value !== "") {
      linkRef.current!.focus();
      showWarning("Please add the written Link or erase it");
    } else if (id && updatingTask) {
      let data = {
        id: updatingTask.id,
        startDate: creationRef.current!.value
          ? creationRef.current!.value
          : updatingTask.startDate,
        title: titleRef.current!.value,
        description: descriptionRef.current!.value,
        categories,
        tags,
        links,
        deadline: deadlineRef.current!.value,
        priority: priorityRef.current!.value,
        progress: accomplished ? "Finished" : progressRef.current!.value,
        progressDesc: progressDescriptions,
        accomplished,
        accomplishedDate: !!accomplishedDate ? accomplishedDate : "",
        updateDate: !!updateDate ? updateDate : getCurrentTime(),
        createdAt: updatingTask.createdAt
          ? updatingTask.createdAt
          : creationRef.current!.value,
      };

      if (!!id && userID?.userUID) {
        const updating = await updateDoc(doc(db,  `user/${userID?.userUID}/tasks`, id), data).then(
          (res) => {
            getNewTasksLists();
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        );
      }
    }
  };

  return (
    <Container
      as="main"
      id="new-post-main"
      py={10}
      px={[3, 3, 6]}
      width="70%"
      maxW={"700px"}
      borderRadius="2rem"
      boxShadow={"m"}
      backgroundColor={
        priority === "High"
          ? "hsla(5, 49%, 92%)"
          : priority === "Middle"
          ? "hsla(29, 70%, 95%)"
          : "hsla(56, 63%, 98%)"
      }
      color="#232323"
    >
      <Heading as="h3" fontSize={20} mb={6}>
        Updating task: {updatingTask?.id}
      </Heading>
      <Box mb={4}>
        {/* accomplished date */}
        <FormControl
          boxShadow={"md"}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0 0 0.5rem 0.5rem"}
          display={"flex"}
          w="fit-content"
          m="0 auto"
          flexDirection={"column"}
          alignItems={"center"}
        >
          <FormLabel textAlign={"center"}>Accomplished?</FormLabel>
          <HStack m="0rem auto 0.5rem">
            <Button
              style={
                accomplished
                  ? { outline: "2px solid #0d0d0d", outlineOffset: "0.2rem" }
                  : {}
              }
              type="button"
              mr={4}
              bg={priorityColors.desatACCOMPLISHED}
              onClick={() => setAccomplished((acc) => true)}
            >
              Yes
            </Button>
            <Button
              style={
                !accomplished
                  ? { outline: "2px solid #0d0d0d", outlineOffset: "0.2rem" }
                  : {}
              }
              type="button"
              bg={priorityColors.desatHIGH}
              ml={4}
              onClick={() => setAccomplished((acc) => false)}
            >
              No
            </Button>
          </HStack>
          {accomplished && (
            <Box>
              <FormLabel>When did you finish this task?</FormLabel>
              <Input
                placeholder="Select Date and Time"
                value={accomplishedDate}
                onChange={(e) => {
                  setAccomplishedDate(e.target.value);
                }}
                size="md"
                type="date"
              />
            </Box>
          )}
        </FormControl>
        {/* priority */}
        <FormControl
          boxShadow={"md"}
          mt={4}
          borderRadius={"0.5rem"}
          backgroundColor={
            priority === "High"
              ? "hsla(5, 49%, 52%, 0.5)"
              : priority === "Middle"
              ? "hsla(29, 70%, 70%,  0.5)"
              : "hsla(56, 63%, 83%, 0.5)"
          }
          p={"1rem 1.5rem"}
        >
          <FormLabel>Priority Level</FormLabel>
          <Select
            ref={priorityRef}
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
            }}
          >
            {["Low", "Middle", "High"].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </FormControl>
        {/* title */}
        <FormControl
          mt={4}
          boxShadow={"md"}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
          isRequired
        >
          <FormLabel>Title</FormLabel>
          <Input
            variant={"filled"}
            errorBorderColor="red.300"
            type="text"
            ref={titleRef}
            autoFocus
          />
        </FormControl>
        {/* description */}
        <FormControl
          boxShadow={"md"}
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
          // isRequired
        >
          <FormLabel>Description</FormLabel>
          <Textarea errorBorderColor="red.300" ref={descriptionRef} rows={5} />
        </FormControl>
        {/* deadline */}
        <FormControl
          boxShadow={"md"}
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
        >
          <FormLabel>Start Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            ref={creationRef}
            size="md"
            type="date"
            mb={4}
            pattern="\d{4}-\d{2}-\d{2}"
          />
          <FormLabel color={priorityColors.HIGH}>
            Deadline <i className="iIcon deadlineIcon" />
          </FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            ref={deadlineRef}
          />
        </FormControl>
        {/* categories */}
        <FormControl
          boxShadow={"md"}
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
        >
          <FormLabel>Categories</FormLabel>
          {["Work", "Study", "Personal"].map((category) => (
            <Checkbox
              key={category}
              onChange={(e) => {
                e.stopPropagation();
                setCategories((prev) =>
                  (e.target as HTMLInputElement).checked
                    ? [...prev, category]
                    : [...prev].filter((cat) => cat !== category)
                );
              }}
              m={3}
              marginLeft={0}
              size="md"
              isChecked={categories.includes(category)}
              colorScheme="gray"
            >
              {category}
            </Checkbox>
          ))}
        </FormControl>
        {/* tags */}
        <FormControl
          boxShadow={"md"}
          id="tag-form-control"
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
          // isRequired
        >
          <FormLabel>Tags</FormLabel>
          <HStack>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTags((tag) => [...tag, tagRef.current!.value]);
                tagRef.current!.value = "";
              }}
            >
              <Flex>
                <Input maxWidth={"300px"} type="text" ref={tagRef} />
                <Button ml={4} type="submit" _hover={{ borderColor: "black" }}>
                  Add Tag
                </Button>
              </Flex>
            </form>
          </HStack>
          <Box py={2} mt={4}>
            {tags.map((tag, i) => (
              <Button
                _hover={{
                  backgroundColor: "red.500",
                  color: "#fefefe",
                  borderColor: "red.500",
                }}
                key={tag + i}
                type="button"
                px={3}
                colorScheme="gray"
                fontSize={"sm"}
                fontWeight={500}
                mr="2"
                mb={2}
                onClick={(e) => {
                  e.stopPropagation();
                  setTags([...tags].filter((t) => t !== tag));
                }}
              >
                #{tag} <DeleteIcon ml={4} />
              </Button>
            ))}
          </Box>
        </FormControl>
        {/* links */}
        <FormControl
          boxShadow={"md"}
          id="links-form-control"
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLinks((link) => [...link, linkRef.current!.value]);
              linkRef.current!.value = "";
            }}
          >
            <FormLabel>Links</FormLabel>
            <Input maxWidth={"600px"} type="text" ref={linkRef} />
            <Button mt={4} type="submit" _hover={{ borderColor: "black" }}>
              Add Link
            </Button>
          </form>
          {!!links.length && (
            <Box p={2} mt={2} boxShadow="inner" backgroundColor={"#efefef"}>
              <Text mt={2} ml={"1.25rem"} fontSize={"0.7rem"} color="gray.400">
                (if you click on the link, you can check if it is correct)
              </Text>
              {links.map((link, i) => (
                <Box key={link + i} p={2} my={2}>
                  <Link target={"_blank"} href={link} className="igName">
                    <i className="iIcon linkIcon"></i>
                    {link}
                  </Link>
                  <Button
                    bg="red.500"
                    color={"#fefefe"}
                    ml={4}
                    p={"0rem 1rem"}
                    h="fit-content"
                    fontSize="0.9rem"
                    lineHeight="1rem"
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinks((links) => {
                        return links.filter((l) => l !== link);
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </FormControl>
        {/* progress */}
        <FormControl
          mt={4}
          boxShadow={"md"}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0 0 0.5rem 0.5rem"}
        >
          <FormLabel>Progress</FormLabel>
          <Select defaultValue={"Not Started"} ref={progressRef}>
            {[
              "Not Started",
              "Initial",
              "Intermediate",
              "Advanced",
              "Finished",
            ].map((progress) => (
              <option key={progress} value={progress}>
                {progress}
              </option>
            ))}
          </Select>
        </FormControl>
        {/* progress description */}
        <FormControl
          mt={4}
          boxShadow={"md"}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0 0 0.5rem 0.5rem"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setProgressDescriptions((steps) => [
                ...steps,
                progressDescRef.current!.value,
              ]);
              progressDescRef.current!.value = "";
            }}
          >
            <FormLabel>Progress Steps</FormLabel>
            <Input maxWidth={"600px"} type="text" ref={progressDescRef} />
            <Button mt={4} type="submit" _hover={{ borderColor: "black" }}>
              Add Step
            </Button>
          </form>
          {!!progressDescriptions.length && (
            <Box p={2} mt={2} boxShadow="inner" backgroundColor={"#efefef"}>
              {progressDescriptions.map((step, i) => (
                <Box key={step + i} p={2} my={2}>
                  <Link target={"_blank"} href={step} className="igName">
                    {step}
                  </Link>
                  <Button
                    colorScheme="red"
                    color={"#fefefe"}
                    ml={4}
                    p={"0rem 1rem"}
                    h="fit-content"
                    fontSize="0.9rem"
                    lineHeight="1rem"
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProgressDescriptions((steps) => {
                        return steps.filter((l) => l !== step);
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </FormControl>
        {/* update date */}
        <FormControl
          mt={4}
          boxShadow={"md"}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0 0 0.5rem 0.5rem"}
        >
          <FormLabel>Update Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
            size="md"
            type="date"
          />
        </FormControl>

        <Button
          type="button"
          mt={4}
          display="block"
          marginLeft={"auto"}
          alignSelf="center"
          _hover={{ borderColor: "black" }}
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}
