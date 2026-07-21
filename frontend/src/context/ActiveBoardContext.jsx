import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ActiveBoardContext = createContext();

export function ActiveBoardProvider({ children }) {
  const { user } = useAuth();

  const storageKey = user
    ? `activeBoard_${user._id}`
    : null;
    console.log("ACTIVE BOARD USER:", user);
console.log("ACTIVE BOARD STORAGE KEY:", storageKey);

  const [activeBoard, setActiveBoard] = useState(() => {
    return null;
  });


  // Load user's saved board when user changes
  useEffect(() => {
    if (!storageKey) {
      setActiveBoard(null);
      return;
    }

    const savedBoard = localStorage.getItem(storageKey);

    setActiveBoard(
      savedBoard ? JSON.parse(savedBoard) : null
    );

  }, [storageKey]);


  // Save user's selected board
  useEffect(() => {
    if (!storageKey) return;

    if (activeBoard) {
      localStorage.setItem(
        storageKey,
        JSON.stringify(activeBoard)
      );
    } else {
      localStorage.removeItem(storageKey);
    }

  }, [activeBoard, storageKey]);


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