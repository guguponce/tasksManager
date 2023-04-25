import { Box, Heading, Wrap } from "@chakra-ui/react";
import React from "react";
import TaskBox from "./TaskBox";
import { CategoryTypes, iRetrievedTask } from "../utils/interfaces";

interface Props {
  tasks: iRetrievedTask[] | null | undefined;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<iRetrievedTask | undefined>
  >;
  priorityFilter: "High" | "Middle" | "Low" | undefined;
  typeTasks: CategoryTypes;
}

export default function TasksContainer({
  tasks,
  typeTasks,
  toggleModal,
  setSelectedTask,
  priorityFilter,
}: Props) {
  return (
    <Box id="tasksDisplay" my={4}>
      {!!tasks?.length ? (
        <Wrap justify={"center"} spacing={{ base: 3, xl: 6 }}>
          {tasks.map((task, i) => (
            <React.Fragment key={task.id}>
              <TaskBox
                toggleModal={toggleModal}
                setSelectedTask={setSelectedTask}
                task={task}
                i={i}
              />
            </React.Fragment>
          ))}
        </Wrap>
      ) : (
        <Heading
          animate={{
            opacity: [0, 1],
          }}
          // @ts-ignore no problem in operation, although type error appears.
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          as="h4"
          fontSize={"1.5rem"}
          mt={6}
          textAlign={"center"}
        >
          There are no {!!priorityFilter && `${priorityFilter.toLocaleLowerCase()} priority `} {typeTasks === "All" ? "" : typeTasks.toLowerCase()}{" "}
          
          tasks
        </Heading>
      )}
    </Box>
  );
}
