import { createContext, useContext, useState } from "react";

const ActiveBoardContext = createContext();

export function ActiveBoardProvider({ children }) {
  const [activeBoard, setActiveBoard] = useState(null);

  return (
    <ActiveBoardContext.Provider value={{ activeBoard, setActiveBoard }}>
      {children}
    </ActiveBoardContext.Provider>
  );
}

export function useActiveBoard() {
  return useContext(ActiveBoardContext);
}