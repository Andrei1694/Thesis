import { io } from 'socket.io-client';
import { cpuUsage } from 'os-utils';
import logger from './logger.mjs';

const URL = 'http://localhost:4000';
const deviceName = 'adsasddas';
const reconnectInterval = 5000; // Retry connection every 5 seconds
const streamInterval = 1000; // Stream data every 10 seconds

const EventTypes = Object.freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  CHECK_DEVICE_EXISTS: 'CHECK_DEVICE_EXISTS',
  DEVICE_EXISTS: 'DEVICE_EXISTS',
  JOIN_ROOM: 'JOIN_ROOM',
  SEND_DATA: 'SEND_DATA',
  SEND_DATA_TO_DB: 'SEND_DATA_TO_DB',
  DESKTOP_CONNECTED: 'DESKTOP_CONNECTED',
  DESKTOP_DISCONNECTED: 'DESKTOP_DISCONNECTED'
});

const myDevice = {
  deviceName: 'myDevice',
  description: "lorem ipsum dolor sit amet",
  location: "New York",
  country: "USA",
  ipAddress: "192.168.1.100",
  serialNumber: "1234567890",
  manufacturer: "Apple",
  key: "1234567890"
}

function createSocketService(url) {
  let socket = io(url, {
    path: '/socket.io',
    query: { clientType: 'device' },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  });

  let streamingInterval;
  let isDesktopConnected = false;

  logger.info(`Device Client (${deviceName}) started and trying to connect to ${url}`);

  socket.on(EventTypes.CONNECT, () => {
    logger.info(`Device Client (${deviceName}) connected to the backend server`);
    socket.emit(EventTypes.CHECK_DEVICE_EXISTS, myDevice);
  });

  socket.on(EventTypes.DEVICE_EXISTS, (response) => {
    const [exists, device] = response;
    if (exists) {
      logger.info(`Device Client (${deviceName}) already exists in the database`);
    } else {
      logger.info(`Device Client (${deviceName}) does not exist in the database, creating it...`);
      logger.info(device);
    }

    socket.emit(EventTypes.JOIN_ROOM, deviceName);
    startStreaming();
  });

  socket.on(EventTypes.DESKTOP_CONNECTED, () => {
    logger.info(`Desktop client connected to room ${deviceName}`);
    isDesktopConnected = true;
    logger.info(`isDesktopConnected set to: ${isDesktopConnected}`);
    startStreaming();
  });

  socket.on(EventTypes.DESKTOP_DISCONNECTED, () => {
    logger.info(`All desktop clients disconnected from room ${deviceName}`);
    isDesktopConnected = false;
    logger.info(`isDesktopConnected set to: ${isDesktopConnected}`);
    startStreaming();
  });

  socket.on(EventTypes.DISCONNECT, (reason) => {
    logger.warn(`Device Client (${deviceName}) disconnected from the backend server. Reason: ${reason}`);
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    // else the socket will automatically try to reconnect
  });

  socket.on(EventTypes.CONNECT_ERROR, (error) => {
    logger.error(`Device Client (${deviceName}) connection error: ${error.message}`);
  });

  function startStreaming() {
    if (streamingInterval) {
      clearInterval(streamingInterval);
    }

    streamingInterval = setInterval(() => {
      const eventName = isDesktopConnected ? EventTypes.SEND_DATA : EventTypes.SEND_DATA_TO_DB;
      logger.info(`Preparing to send data. isDesktopConnected: ${isDesktopConnected}, EventName: ${eventName}`);
      sendData(eventName);
    }, streamInterval);

    logger.info(`Device Client (${deviceName}) started/restarted streaming data every ${streamInterval}ms. Sending to ${isDesktopConnected ? 'desktop' : 'database'}`);
  }

  function sendData(eventName) {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    cpuUsage((cpuUsage) => {
      const data = {
        cpuUsage,
        time: time,
        roomId: deviceName,
      };
      socket.emit(eventName, data);
      logger.debug(`Device Client (${deviceName}) emitted data via ${eventName} event:`, data);
    });
  }
}

createSocketService(URL);