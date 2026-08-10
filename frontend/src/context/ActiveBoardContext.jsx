import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { ActiveBoardContext } from "./activeBoardContext";

export function ActiveBoardProvider({ children }) {
  const { user } = useAuth();

  const [activeBoard, setActiveBoard] = useState(null);
  const [boardInitialized, setBoardInitialized] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
  
    const savedBoard = localStorage.getItem(
      `activeBoard_${user.id}`
    );
  
    const parsedBoard = savedBoard
      ? JSON.parse(savedBoard)
      : null;
  
    queueMicrotask(() => {
      setActiveBoard(parsedBoard);
      setBoardInitialized(true);
    });
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