import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, Message } from '../types';

interface SocketContextType {
  socket: Socket | null;
  rooms: Room[];
  currentRoom: string | null;
  currentRoomName: string | null;
  messages: Message[];
  createRoom: (name: string, password: string) => Promise<{ success: boolean; roomId: string }>;
  joinRoom: (roomId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentRoomName, setCurrentRoomName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Determine the Socket.IO server URL based on the environment
    const serverUrl = import.meta.env.PROD 
      ? window.location.origin  // Use the same origin in production
      : 'http://localhost:3000'; // Use localhost in development
    
    console.log('Connecting to Socket.IO server at:', serverUrl);

    // Connect to the Socket.IO server
    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Set up event listeners
    socket.on('roomList', (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
    });

    socket.on('newMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up listeners on unmount or socket change
    return () => {
      socket.off('roomList');
      socket.off('newMessage');
    };
  }, [socket]);

  const createRoom = (name: string, password: string): Promise<{ success: boolean; roomId: string }> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve({ success: false, roomId: '' });
        return;
      }

      socket.emit('createRoom', { name, password }, (response: { success: boolean; roomId: string }) => {
        resolve(response);
      });
    });
  };

  const joinRoom = (roomId: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve({ success: false, message: 'No socket connection' });
        return;
      }

      socket.emit('joinRoom', { roomId, password }, (response: { 
        success: boolean; 
        message?: string;
        messages?: Message[];
        roomName?: string;
      }) => {
        if (response.success) {
          setCurrentRoom(roomId);
          setCurrentRoomName(response.roomName || null);
          setMessages(response.messages || []);
        }
        resolve(response);
      });
    });
  };

  const sendMessage = (message: string) => {
    if (!socket || !currentRoom) return;
    
    socket.emit('sendMessage', { roomId: currentRoom, message });
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setCurrentRoomName(null);
    setMessages([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        rooms,
        currentRoom,
        currentRoomName,
        messages,
        createRoom,
        joinRoom,
        sendMessage,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};