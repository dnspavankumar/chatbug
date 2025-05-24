import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface RoomListProps {
  onRoomSelect: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onRoomSelect }) => {
  const { rooms, currentRoom } = useSocket();

  if (rooms.length === 0) {
    return (
      <div className="card text-center">
        <MessageSquare className="mx-auto mb-2 text-accent-info" size={28} />
        <p className="text-dark-muted">No rooms available. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent-info to-accent-primary flex items-center gap-2">
        <MessageSquare size={20} className="text-accent-info" />
        Available Rooms
      </h2>
      
      <ul className="space-y-2">
        {rooms.map((room) => (
          <li key={room.id}>
            <button
              onClick={() => onRoomSelect(room.id)}
              className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all ${
                currentRoom === room.id
                  ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-accent-primary shadow-inner-glow'
                  : 'bg-dark-accent/40 text-dark-text hover:bg-dark-highlight/50 glow-hover'
              }`}
            >
              <span className="font-medium truncate">{room.name}</span>
              <span className="flex items-center text-xs text-dark-muted gap-1">
                <Users size={14} />
                {room.userCount}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;