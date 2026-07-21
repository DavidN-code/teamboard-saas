import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ActiveBoardContext = createContext();

export function ActiveBoardProvider({ children }) {
  const { user } = useAuth();

  const [activeBoard, setActiveBoard] = useState(null);
  const [boardInitialized, setBoardInitialized] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setActiveBoard(null);
      setBoardInitialized(false);
      return;
    }

    const savedBoard = localStorage.getItem(
      `activeBoard_${user.id}`
    );

    if (savedBoard) {
      setActiveBoard(JSON.parse(savedBoard));
    }

    setBoardInitialized(true);

  }, [user]);


  useEffect(() => {
    if (!user?.id || !activeBoard) return;

    localStorage.setItem(
      `activeBoard_${user.id}`,
      JSON.stringify(activeBoard)
    );

  }, [activeBoard, user]);


  return (
    <ActiveBoardContext.Provider
      value={{
        activeBoard,
        setActiveBoard,
        boardInitialized,
      }}
    >
      {children}
    </ActiveBoardContext.Provider>
  );
}


export function useActiveBoard() {
  return useContext(ActiveBoardContext);
}