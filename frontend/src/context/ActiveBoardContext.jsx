import { createContext, useContext, useEffect, useState } from "react";

const ActiveBoardContext = createContext();

export function ActiveBoardProvider({ children }) {
  const [activeBoard, setActiveBoard] = useState(() => {
    const savedBoard = localStorage.getItem("activeBoard");

    return savedBoard
      ? JSON.parse(savedBoard)
      : null;
  });

  useEffect(() => {
    if (activeBoard) {
      localStorage.setItem(
        "activeBoard",
        JSON.stringify(activeBoard)
      );
    } else {
      localStorage.removeItem("activeBoard");
    }
  }, [activeBoard]);

  return (
    <ActiveBoardContext.Provider
      value={{
        activeBoard,
        setActiveBoard,
      }}
    >
      {children}
    </ActiveBoardContext.Provider>
  );
}

export function useActiveBoard() {
  return useContext(ActiveBoardContext);
}