import { io } from 'socket.io-client';
import { cpuUsage } from 'os-utils';
import logger from './logger.mjs';

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

  logger.info(`Device Client (${deviceName}) started and trying to connect to ${url}`);

  socket.on(CONNECT, () => {
    logger.info(`Device Client (${deviceName}) connected to the backend server`);
    socket.emit(JOIN_ROOM, deviceName);
    logger.info(`Device Client (${deviceName}) joined room: ${deviceName}`);
  });

  socket.on(DISCONNECT, () => {
    logger.warn(`Device Client (${deviceName}) disconnected from the backend server`);
    stopStreaming();
    reconnect();
  });

  socket.on(CONNECT_ERROR, (error) => {
    logger.error(`Device Client (${deviceName}) connection error: ${error.message}`);
    reconnect();
  });

  socket.on(START_STREAMING, () => {
    logger.info(`Device Client (${deviceName}) started streaming`);
    startStreaming(streamInterval);
  });

  socket.on(STOP_STREAMING, () => {
    logger.info(`Device Client (${deviceName}) stopped streaming`);
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
        logger.debug(`Device Client (${deviceName}) emitted data to backend via SEND_DATA event:`, data);
      });
    }, interval);

    logger.info(`Device Client (${deviceName}) streaming data every ${interval}ms`);
  }

  function stopStreaming() {
    clearInterval(streamingInterval);
    logger.info(`Device Client (${deviceName}) stopped streaming data`);
  }

  function reconnect() {
    setTimeout(() => {
      logger.info(`Device Client (${deviceName}) attempting to reconnect...`);
      socket.connect();
    }, reconnectInterval);

    logger.info(`Device Client (${deviceName}) will attempt to reconnect in ${reconnectInterval}ms`);
  }
}

createSocketService(URL, 5000);