import { Server } from 'socket.io';
import { cpuUsage } from 'os-utils';
import cors from 'cors';

let interval = null;

export default function socketConnect(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('A client connected');

    // Clear the previous interval if it exists
    if (interval) {
      clearInterval(interval);
    }

    // Start a new interval to emit CPU usage every 10 seconds
    interval = setInterval(() => {
      cpuUsage((cpuUsage) => {
        socket.emit('cpuUsage', cpuUsage);
      });
    }, 1000);

    socket.on('disconnect', () => {
      console.log('A client disconnected');
      clearInterval(interval);
    });
  });

  return io;
}