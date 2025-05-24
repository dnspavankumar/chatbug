import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface JoinRoomModalProps {
  roomId: string | null;
  roomName: string | null;
  onClose: () => void;
  onJoined: () => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  roomId,
  roomName,
  onClose,
  onJoined,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { joinRoom } = useSocket();

  if (!roomId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinRoom(roomId, password);
      if (result.success) {
        onJoined();
      } else {
        setError(result.message || 'Failed to join room');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-start/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-dark-primary to-dark-secondary border border-dark-accent/30 rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-muted hover:text-dark-text transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-accent-primary/20 to-accent-info/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Lock className="text-accent-primary" size={28} />
          </div>
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-info">Join "{roomName}"</h2>
          <p className="text-dark-muted mt-1">This room is password protected</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="room-password" className="block text-sm font-medium text-dark-text mb-1">
              Password
            </label>
            <input
              id="room-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter room password"
              className="input w-full"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="bg-accent-warning/10 border border-accent-warning/30 text-accent-warning px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isJoining}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;