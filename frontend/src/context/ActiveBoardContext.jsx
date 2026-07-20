import { createContext, useContext, useState } from "react";

const ActiveBoardContext = createContext();

export function ActiveBoardProvider({ children }) {
  const [activeBoard, setActiveBoardState] = useState(() => {
    const savedBoard = localStorage.getItem("activeBoard");

    return savedBoard ? JSON.parse(savedBoard) : null;
  });

  const setActiveBoard = (board) => {
    setActiveBoardState(board);

    if (board) {
      localStorage.setItem(
        "activeBoard",
        JSON.stringify(board)
      );
    } else {
      localStorage.removeItem("activeBoard");
    }
  };

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