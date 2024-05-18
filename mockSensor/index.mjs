import { io } from 'socket.io-client';
import { cpuUsage } from 'os-utils';

const URL = 'http://localhost:4000';
const deviceName = 'asdasd';
const reconnectInterval = 5000; // Retry connection every 5 seconds

function createSocketService(url, streamInterval = 1000) {
  let socket = io(url, { query: { clientType: 'device' } });
  let streamingInterval;

  const {
    CONNECT,
    DISCONNECT,
    CONNECT_ERROR,
    STOP_STREAMING,
    START_STREAMING,
    JOIN_ROOM,
    SEND_DATA,
  } = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    STOP_STREAMING: 'STOP_STREAMING',
    START_STREAMING: 'START_STREAMING',
    JOIN_ROOM: 'JOIN_ROOM',
    SEND_DATA: 'SEND_DATA',
  };

  console.log('======Start=====');

  socket.on(CONNECT, () => {
    console.log('Connected to the backend server');
    socket.emit(JOIN_ROOM, deviceName);
  });

  socket.on(DISCONNECT, () => {
    console.log('Disconnected from the backend server');
    stopStreaming();
    reconnect();
  });

  socket.on(CONNECT_ERROR, (error) => {
    console.error('Connection error:', error);
    reconnect();
  });

  socket.on(START_STREAMING, () => {
    console.log('[DEVICE] Streaming Started');
    startStreaming(streamInterval);
  });

  socket.on(STOP_STREAMING, () => {
    console.log('Streaming stopped');
    stopStreaming();
  });

  function startStreaming(interval) {
    streamingInterval = setInterval(() => {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const seconds = currentTime.getSeconds().toString().padStart(2, '0');
      const date = `${hours}:${minutes}:${seconds}`;

      cpuUsage((cpuUsage) => {
        const data = {
          cpuUsage,
          date,
          roomId: deviceName,
        };
        socket.emit(SEND_DATA, data);
        console.log('emmiting')
      });
    }, interval);
  }

  function stopStreaming() {
    clearInterval(streamingInterval);
  }

  function reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      socket.connect();
    }, reconnectInterval);
  }
}

createSocketService(URL, 5000);