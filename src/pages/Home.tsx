import React, { useState } from 'react';
import CreateRoom from '../components/CreateRoom';
import RoomList from '../components/RoomList';
import JoinRoomModal from '../components/JoinRoomModal';
import ChatRoom from '../components/ChatRoom';
import { useSocket } from '../contexts/SocketContext';

const Home: React.FC = () => {
  const { currentRoom, rooms } = useSocket();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Find the name of the selected room
  const selectedRoomName = selectedRoomId 
    ? rooms.find(room => room.id === selectedRoomId)?.name || null
    : null;

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowJoinModal(true);
  };

  const handleRoomCreated = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowJoinModal(true);
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
  };

  const handleBackFromChat = () => {
    setSelectedRoomId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-info mb-2 animate-pulse">
          ChatBUG
        </h1>
        <p className="text-dark-muted text-lg">
          Create or join a room to start chatting
        </p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {currentRoom ? (
          <div className="flex-1 animate-fadeIn">
            <ChatRoom onBack={handleBackFromChat} />
          </div>
        ) : (
          <>
            <div className="md:w-1/3 flex flex-col gap-6 animate-fadeIn">
              <CreateRoom onRoomCreated={handleRoomCreated} />
              <RoomList onRoomSelect={handleRoomSelect} />
            </div>
            <div className="hidden md:flex flex-1 card backdrop-blur-md p-8 shadow-lg items-center justify-center glow-hover">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-primary/30 to-accent-info/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent-success"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-success to-accent-primary mb-2">
                  Welcome to ChatBug
                </h2>
                <p className="text-dark-muted max-w-md mx-auto">
                  Select a room from the list or create your own to start chatting.
                  All rooms are password protected for privacy.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {showJoinModal && (
        <JoinRoomModal
          roomId={selectedRoomId}
          roomName={selectedRoomName}
          onClose={() => setShowJoinModal(false)}
          onJoined={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default Home;