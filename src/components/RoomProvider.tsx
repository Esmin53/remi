"use client"; // Marking it as a Client Component
import { createContext, ReactNode, useContext } from "react";

// Define the shape of roomData
interface RoomData {
  owner: string | null;
  background: string;
  table: string;
  deck: string;
}

// Create the context with proper types (can be null initially)
const RoomDataContext = createContext<RoomData | null>(null);

interface RoomProviderProps {
  children: ReactNode;
  roomData: RoomData; // Use the RoomData interface for roomData prop
}

// RoomProvider component
export default function RoomProvider({ children, roomData }: RoomProviderProps) {
  return (
    <RoomDataContext.Provider value={roomData}>
      {children}
    </RoomDataContext.Provider>
  );
}

// Custom hook to consume the context
export const useRoomData = () => {
  const context = useContext(RoomDataContext);
  if (!context) {
    throw new Error("useRoomData must be used within a RoomProvider");
  }
  return context;
};

