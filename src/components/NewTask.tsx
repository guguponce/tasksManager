import { useNavigate } from "react-router-dom";

import {
  useToast,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  ListItem,
  Link,
  Flex,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FirestoreContext } from "../firebase/Firestore";
import { iRetrievedTask, iSubmittedTaskData, priorityColors } from "../utils/interfaces";
import { DeleteIcon } from "@chakra-ui/icons";
import { getCurrentDate, prioColor } from "../utils/utils";
import { AuthContext } from "../firebase/AuthFirebase";

export default function NewTask() {
  const [id, setId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const [priority, setPriority] = useState<string>("low");
  const [progressDescriptions, setProgressDescriptions] = useState<string[]>(
    []
  );
const [formProcess, setFormProcess] = useState<
    "ready" | "loading" | "selected"
  >("ready");

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const progressRef = useRef<HTMLSelectElement>(null);
  const progressDescRef = useRef<HTMLInputElement>(null);
  const creationRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
    const {userID} = useContext(AuthContext)
  const { retrievedTasks, addTask, getNewTasksLists, oneTimeSession } =
    useContext(FirestoreContext);
  const date = useRef<string>("");

  

  const showWarning = (title: string) => {
    toast({
      title,
      status: "error",
      isClosable: true,
      position: "top",
      duration: 3000,
    });
  };

  useEffect(() => {
    const currentDate = getCurrentDate()
    date.current = currentDate
    setId(
      !!retrievedTasks && !!retrievedTasks.length
        ? currentDate + "/" + (retrievedTasks.length + 1)
        : currentDate + "/" + 1
    );
  }, [retrievedTasks]);

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!categories.length) {
      showWarning("Please add category");
    } else if (tagRef.current!.value !== "") {
      tagRef.current!.focus();
      showWarning("Please add the written Tag or erase it");
    } else if (linkRef.current!.value !== "") {
      linkRef.current!.focus();
      showWarning("Please add the written Link or erase it");
    } else {
      let data: iSubmittedTaskData = {
        id: id,
        title: titleRef.current!.value,
        description: descriptionRef.current!.value,
        categories,
        tags,
        links,
        deadline: deadlineRef.current!.value,
        priority: priorityRef.current!.value,
        progress: progressRef.current!.value,
        progressDesc: progressDescriptions,
        accomplished: false,
        accomplishedDate: "",
        startDate: creationRef.current!.value
          ? creationRef.current!.value
          : date.current,
        updateDate: "",
        createdAt: date.current
      };
      if(submitBtnRef.current){submitBtnRef.current.disabled = true}
      if (!!userID?.userUID) {
        const adding = await addTask(userID.userUID, data);
        if (adding) {
          getNewTasksLists();
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else if(oneTimeSession){
        if(!!retrievedTasks){
        const modifiedTasks: iRetrievedTask[] = [...retrievedTasks, {id: id.replace("/", "-"), data}]
        localStorage.setItem("tasks", JSON.stringify(modifiedTasks))
        getNewTasksLists();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      }
    }
  };
  // set customized date

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
        New Task
      </Heading>
      <Box mb={4}>
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
          <FormLabel>Deadline</FormLabel>
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
          isRequired
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
                #{tag}
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
          boxShadow={"md"}
          id="progress-form-control"
          mt={4}
          backgroundColor={"#fefefe"}
          p={"1rem 1.5rem"}
          borderRadius={"0.5rem"}
        >
          <FormLabel>Progress</FormLabel>
          <Select defaultValue={"Not Started"} ref={progressRef} mb={6}>
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
        {/* start date */}
        <FormControl
          boxShadow={"md"}
          id="tag-form-control"
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
          />
        </FormControl>

        <Button
          ref={submitBtnRef}
          _disabled={{color: "#ccc", backgroundColor:"#aaa"}}
          background={priorityColors.ACCOMPLISHED}
          color="#fefefe"
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
