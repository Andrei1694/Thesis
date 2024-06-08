import { Server } from 'socket.io';
import cors from 'cors';
import MeasurmentService from './measurment.service.mjs';

const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';
const CPU_USAGE = 'cpu_usage';
const DEVICE_IS_ONLINE = 'DEVICE_IS_ONLINE';
const JOIN_ROOM = 'JOIN_ROOM';
const SEND_DATA = 'SEND_DATA';

export default function SocketIOService(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      path: '/socket.io'
    },
  });

  const roomCounts = {};
  const clientRooms = {};

  io.on(CONNECTION, (socket) => {
    console.log(`A client connected ${socket.id}`);
    const clientType = socket.handshake.query.clientType;

    socket.on(JOIN_ROOM, (roomId) => {
      if (clientRooms[socket.id] && clientRooms[socket.id] === roomId) {
        console.log(`Client ${socket.id} already joined room ${roomId}`);
        return;
      }

      socket.join(roomId);
      clientRooms[socket.id] = roomId;
      console.log(`${clientType} client ${socket.id} joined room ${roomId}`);

      if (clientType === 'device') {
        io.to(roomId).emit(DEVICE_IS_ONLINE, true);
      }

      if (clientType === 'desktop') {
        roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;
      }

      socket.emit('START_STREAMING');
    });

    socket.on(SEND_DATA, async (data) => {
      const { roomId, ...rest } = data;
      console.log('=====');
      console.log(rest);
      console.log(roomCounts);

      if (roomCounts[roomId] > 0) {
        // Emit the data to all connected desktop clients in the room
        console.log('send it to desktop');
        console.log(roomCounts);
        io.to(roomId).emit('RECEIVE_DATA', rest);
      } else {
        // No desktop client connected, send data to the database
        try {
          //   await MeasurmentService.createMeasurment(rest);
          console.log('Data sent to the database:', rest);
        } catch (error) {
          console.error('Error sending data to the database:', error);
        }
      }
    });

    socket.on(DISCONNECT, () => {
      console.log(`A client disconnected ${socket.id}`);
      const roomId = clientRooms[socket.id];

      if (clientType === 'desktop') {
        roomCounts[roomId]--;
      }

      delete clientRooms[socket.id];
    });
  });

  return { io };
}