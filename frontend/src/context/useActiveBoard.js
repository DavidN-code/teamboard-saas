import { useContext } from "react";
import { ActiveBoardContext } from "./activeBoardContext";

export function useActiveBoard() {
  return useContext(ActiveBoardContext);
}