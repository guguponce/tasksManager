import { Icon, chakra, shouldForwardProp } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { priorityColors } from "./interfaces";

export function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

export const handleScroll = (
  setCount: (value: React.SetStateAction<number>) => void,
  count: number
) => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight - 200 && count < 100) {
    setCount(count + 10);
  }
};

export const ChakraList = chakra(motion.li, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

export const ChakraContainer = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

export const dateFormatter = (date: string) =>
  date.replace(/(\d+)-(\d+)-(\d+)/, "$3-$2-$1");

export const borColor = (priority: string) =>
  priority === "High"
    ? {
        backgroundColor: priorityColors.desatHIGH,
        border: `2px solid ${priorityColors.HIGH}`,
      }
    : priority === "Middle"
    ? {
        backgroundColor: priorityColors.desatMIDDLE,
        border: `2px solid ${priorityColors.MIDDLE}`,
      }
    : priority === "Low"
    ? {
        backgroundColor: priorityColors.desatLOW,
        border: `2px solid ${priorityColors.LOW}`,
      }
    : {};

export const prioColor  = (accomplished: boolean, priority: string) =>
  accomplished ? priorityColors.ACCOMPLISHED
  : priority === "High"
  ? priorityColors.HIGH
  : priority === "Middle"
  ? priorityColors.MIDDLE
  : priorityColors.LOW;

export const desatColor = (accomplished: boolean, priority: string) =>
  accomplished
    ? "hsla(124, 40%, 80%,0.3)"
    : priority === "High"
    ? "hsla(5, 49%, 52%, 0.3)"
    : priority === "Middle"
    ? "hsla(29, 88%, 70%, 0.3)"
    : "hsla(56, 90%, 80%,0.3)";

export const superDesatColor = (accomplished: boolean, priority: string) =>
  accomplished
    ? "hsl(120, 97%, 98%)"
    : priority === "High"
    ? "hsla(5, 49%, 98%, 1)"
    : priority === "Middle"
    ? "hsla(29, 88%, 98%, 1)"
    : "hsla(56, 90%, 98%,1)";

export const CircleIcon = ({ color }: { color: string }) => (
  <Icon viewBox="0 0 200 200" color="red.500">
    <path
      fill={color}
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);
