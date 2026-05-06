import { Server } from 'socket.io';

const initlizeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      // origin: config.clientUrl || "http://localhost:5173",
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  io.on('connection', (socket) => {

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
  return io;
};

export default initlizeSocket;
