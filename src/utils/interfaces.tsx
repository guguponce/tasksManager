export interface iSubmittedTaskData {
  id: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  links: string[];
  deadline: string;
  priority: string;
  progress: string;
  progressDesc: string[];
  startDate: string;
  accomplished: boolean;
  accomplishedDate: string;
  updateDate: string;
  createdAt: string;
}
export const iSubmittedTaskDataExample = {
  id: "string",
  title: "string",
  description: "string",
  categories: ["string"],
  tags: ["string"],
  links: ["string"],
  deadline: "string",
  priority: "string",
  progress: "string",
  progressDesc: ["string"],
  startDate: "string",
  accomplished: false,
  accomplishedDate: "string",
  updateDate: "string",
  createdAt: "string",
};
export interface iRetrievedTask {
  id: string;
  data: iSubmittedTaskData;
}

export interface iFirestoreContext {
  addTask: (userUID: string, data: iSubmittedTaskData) => Promise<string | undefined>;
  getTasks: (userUID: string) => Promise<{ id: string; data: iSubmittedTaskData }[] | null>;
  retrievedTasks: iRetrievedTask[] | null | undefined;
  getNewTasksLists: () => void;
}

export type CategoryTypes = "All" | "Work" | "Study" | "Personal";
export type PriorityTypes = "Low" | "Middle" | "High" | undefined;
export enum priorityColors {
  ACCOMPLISHED = "hsl(124, 40%, 70%)",
  desatACCOMPLISHED = "hsla(124, 40%, 80%,0.3)",
  desatHIGH = "hsla(5, 49%, 52%, 0.3)",
  HIGH = "hsla(5, 62%, 41%, 1)",
  desatMIDDLE = "hsla(29, 88%, 70%, 0.3)",
  MIDDLE = "hsla(29, 88%, 63%, 1)",
  LOW = "hsla(55, 92%, 70%,1)",
  desatLOW = "hsla(56, 90%, 80%,0.3)",
}
