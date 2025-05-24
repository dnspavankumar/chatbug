import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Fallback route handler for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// In-memory storage for rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  
  // Send the list of rooms to the newly connected user
  socket.emit('roomList', Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    name: room.name,
    userCount: room.users.size
  })));

  // Handle room creation
  socket.on('createRoom', ({ name, password }, callback) => {
    const roomId = uuidv4();
    rooms.set(roomId, {
      id: roomId,
      name,
      password,
      users: new Set(),
      messages: []
    });
    
    // Broadcast the updated room list to all connected clients
    io.emit('roomList', Array.from(rooms.entries()).map(([id, room]) => ({
      id,
      name: room.name,
      userCount: room.users.size
    })));
    
    callback({ success: true, roomId });
  });

  // Handle join room request
  socket.on('joinRoom', ({ roomId, password }, callback) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      return callback({ success: false, message: 'Room not found' });
    }
    
    if (room.password !== password) {
      return callback({ success: false, message: 'Incorrect password' });
    }
    
    // Leave previous room if any
    const previousRooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    previousRooms.forEach(roomId => {
      const prevRoom = rooms.get(roomId);
      if (prevRoom) {
        prevRoom.users.delete(socket.id);
        socket.leave(roomId);
        
        // Broadcast updated user count
        io.emit('roomList', Array.from(rooms.entries()).map(([id, room]) => ({
          id,
          name: room.name,
          userCount: room.users.size
        })));
      }
    });
    
    // Join the new room
    socket.join(roomId);
    room.users.add(socket.id);
    
    // Send room history
    callback({
      success: true,
      messages: room.messages,
      roomName: room.name
    });
    
    // Broadcast updated user count
    io.emit('roomList', Array.from(rooms.entries()).map(([id, room]) => ({
      id,
      name: room.name,
      userCount: room.users.size
    })));
  });

  // Handle chat messages
  socket.on('sendMessage', ({ roomId, message }) => {
    const room = rooms.get(roomId);
    
    if (room) {
      const messageData = {
        id: uuidv4(),
        text: message,
        senderId: socket.id,
        timestamp: new Date().toISOString()
      };
      
      room.messages.push(messageData);
      io.to(roomId).emit('newMessage', messageData);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    
    // Remove user from any rooms they were in
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        
        // If room is empty, consider removing it
        if (room.users.size === 0 && room.messages.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
    
    // Broadcast updated room list
    io.emit('roomList', Array.from(rooms.entries()).map(([id, room]) => ({
      id,
      name: room.name,
      userCount: room.users.size
    })));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});