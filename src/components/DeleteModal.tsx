import {
  Button,
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

export default function PostModal({
  postTitle,
  handleDeleteTask,
}: {
  postTitle: string;
  handleDeleteTask: () => Promise<void>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="solid" bg="red.600" color="#fefefe" onClick={onOpen}>
        Delete Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.600" backgroundColor={"red.100"}>
            {`Do you want to delete this task:`}<br/>
            {`"${postTitle}"`}
            
          </ModalHeader>
          <ModalCloseButton mt={2} />
         

          <ModalFooter>
            <Button colorScheme="blackAlpha" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme={"red"}
              _disabled={{ outline: 0, border: 0 }}
              _visited={{}}
              onClick={handleDeleteTask}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
