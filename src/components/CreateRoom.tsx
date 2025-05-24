import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface CreateRoomProps {
  onRoomCreated: (roomId: string) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onRoomCreated }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const { createRoom } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Room name is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createRoom(name.trim(), password);
      if (result.success) {
        setName('');
        setPassword('');
        onRoomCreated(result.roomId);
      } else {
        setError('Failed to create room');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="card glow-hover">
      <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Create a New Room</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="room-name" className="block text-sm font-medium text-dark-text mb-1">
            Room Name
          </label>
          <input
            id="room-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter room name"
            className="input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="room-password" className="block text-sm font-medium text-dark-text mb-1">
            Password
          </label>
          <input
            id="room-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a password"
            className="input w-full"
          />
        </div>
        
        {error && <p className="text-accent-warning text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={isCreating}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;