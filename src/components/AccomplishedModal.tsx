import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { iRetrievedTask, iSubmittedTaskData } from "../utils/interfaces";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { FirestoreContext } from "../firebase/Firestore";
import { AuthContext } from "../firebase/AuthFirebase";

export default function AccomplishedModal({
  id,
  task,
}: {
  id: string;
  task: iSubmittedTaskData;
}) {
  const [accomplished, setAccomplished] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { getNewTasksLists, oneTimeSession, retrievedTasks } =
    useContext(FirestoreContext);
  const { userID } = useContext(AuthContext);
  const [accomplishedDate, setAccomplishedDate] = useState<string>();

  const currentDate = useMemo(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() < 10 ? "0" + now.getMonth() : now.getMonth()
    }-${now.getDate()}`;
    setAccomplishedDate(date);
    return date;
  }, []);

  const handleAccomplished = async () => {
    if (accomplishedDate && !!userID?.userUID) {
      const updating = await updateDoc(
        doc(db, `user/${userID?.userUID}/tasks`, id),
        {
          ...task,
          accomplished,
          accomplishedDate: !!accomplishedDate ? accomplishedDate : currentDate,
          progress: "Finished",
        }
      ).then((res) => {
        getNewTasksLists();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    } else if (oneTimeSession && !!retrievedTasks) {
      const modifiedTasks: iRetrievedTask[] = [
        ...retrievedTasks.filter((t) => t.id !== id),
        {
          id,
          data: {
            ...task,
            accomplished,
            accomplishedDate: !!accomplishedDate
              ? accomplishedDate
              : currentDate,
            progress: "Finished",
          },
        },
      ];
      localStorage.setItem("tasks", JSON.stringify(modifiedTasks));
      getNewTasksLists();
      setTimeout(() => {
        navigate("/");
      }, 1000);
      }
  };

  return (
    <>
      <Checkbox
        colorScheme="green"
        isChecked={accomplished}
        onChange={() => {
          setAccomplished((prev) => !prev);
          !accomplished && onOpen();
        }}
      >
        Accomplished?
      </Checkbox>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setAccomplished(false);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.600" backgroundColor={"green.100"}>
            {`Have you accomplished this task:`}
            <br />
            {`"${task.title}"`}
          </ModalHeader>
          <ModalCloseButton
            mt={2}
            onClick={() => {
              setAccomplished(false);
              onClose();
            }}
          />
          <ModalBody>
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
              <FormLabel>When did you finish this task?</FormLabel>
              {/* {accomplishedDate} */}
              <Input
                placeholder="Select Date and Time"
                value={accomplishedDate}
                defaultValue={currentDate}
                onChange={(e) => {
                  setAccomplishedDate(e.target.value);
                }}
                size="md"
                type="date"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              mr={3}
              onClick={() => {
                setAccomplished(false);
                onClose();
              }}
            >
              Not done yet
            </Button>
            <Button
              variant="solid"
              colorScheme={"green"}
              onClick={handleAccomplished}
            >
              Accomplished
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
