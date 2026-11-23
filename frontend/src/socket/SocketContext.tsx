import type { Socket } from 'socket.io-client'
import { createContext, useContext } from "react";

export const SocketContext = createContext<Socket | null | undefined>(null)

export function useSocketContext() {
  return useContext(SocketContext)
}
