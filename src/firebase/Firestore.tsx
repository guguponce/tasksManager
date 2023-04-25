import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, storage } from "../firebase/firebase";
import { iSubmittedTaskData,iFirestoreContext, iRetrievedTask } from "../utils/interfaces";
import { AuthContext } from "./AuthFirebase";


export interface iUploadImg {
  file: FileList | null | undefined;
  data: iSubmittedTaskData;
}
export async function getTasks(userUID: string) {
  const tasksRef = collection(db, `user/${userUID}/tasks`);
  let tasks: { id: string; data: iSubmittedTaskData }[] = [];
  try {
    const queryTasks = await getDocs(tasksRef);
    queryTasks.forEach((doc) =>
      tasks.push({ id: doc.id, data: doc.data() as iSubmittedTaskData })
    );
    return tasks;
  } catch (err) {
    console.log("err", err);
    return null;
  }
}
export async function addTask(userUID: string,data: iSubmittedTaskData) {
  try {
    const adding = await addDoc(collection(db, `user/${userUID}/tasks`), data);
    return adding.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const FirestoreContext = createContext<iFirestoreContext>({
  addTask,
  getTasks,
  retrievedTasks: [],
  getNewTasksLists: () => {},
});

export default function FirestoreProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [retrievedTasks, setRetrievedTasks] = useState<
    iRetrievedTask[] | null
  >();
  const [taskChange, toggleTaskChange] = useState<boolean>(false);
  const { logged, userID } = useContext(AuthContext)
  useEffect(() => {
    logged && !!userID?.userUID ?
    getTasks(userID.userUID).then((res) => {
      
      if (res !== null) {

        setRetrievedTasks(
          [...res].sort((a, b) => {
            const aDate = /\d+-\d+-\d+/
              .exec(a.data.id)![0]
              .replaceAll("-", "/");
            const bDate = /\d+-\d+-\d+/
              .exec(b.data.id)![0]
              .replaceAll("-", "/");
            let date1 = new Date(aDate).getTime();
            let date2 = new Date(bDate).getTime();

            if (date1 < date2) {
              return -1;
            } else if (date1 > date2) {
              return 1;
            } else {
              const aId = /\d+$/.exec(a.data.id)![0];
              const bId = /\d+$/.exec(b.data.id)![0];
              const aNum = parseInt(aId);
              const bNum = parseInt(bId);
              return bNum - aNum;
            }
          })
        );
      }
    }) : setRetrievedTasks(null)
  }, [taskChange, logged]);

  

  
  function getNewTasksLists() {
    toggleTaskChange(!taskChange);
  }
  

  return (
    <FirestoreContext.Provider
      value={{ getNewTasksLists, retrievedTasks, addTask, getTasks }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}
