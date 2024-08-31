import { Server } from 'socket.io';
import Device from '../models/Device.model.mjs';
import MeasurementService from './measurment.service.mjs'
import { createDeviceWithSensors } from './sensor.service.mjs';
const EventTypes = Object.freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CHECK_DEVICE_EXISTS: 'CHECK_DEVICE_EXISTS',
  DEVICE_EXISTS: 'DEVICE_EXISTS',
  JOIN_ROOM: 'JOIN_ROOM',
  SEND_DATA: 'SEND_DATA',
  SEND_DATA_TO_DB: 'SEND_DATA_TO_DB',
  DESKTOP_CONNECTED: 'DESKTOP_CONNECTED',
  DESKTOP_DISCONNECTED: 'DESKTOP_DISCONNECTED',
  RECEIVE_DATA: 'RECEIVE_DATA'
});

export default function SocketIOService(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    path: '/socket.io'
  });

  const roomCounts = {};
  const clientRooms = {};

  io.on(EventTypes.CONNECT, (socket) => {
    console.log(`A client connected: ${socket.id}`);
    const clientType = socket.handshake.query.clientType;

    socket.on(EventTypes.CHECK_DEVICE_EXISTS, async (deviceJson) => {
      try {
        console.log('deviceJson:', deviceJson);
        const { key, sensors, ...deviceData } = deviceJson;
        let device = await Device.findOne({ key });
        if (device) {
          console.log(`Device ${device.deviceName} already exists in the database`);
          socket.emit(EventTypes.DEVICE_EXISTS, [true, device.toObject()]);
        } else {
          const newDevice = new Device({ ...deviceData, key });
          device = await newDevice.save();
          console.log(`Device ${device.deviceName} created in the database`);

          // Create sensors for the device
          if (sensors && Array.isArray(sensors)) {
            for (const sensorData of sensors) {
              try {
                const newSensor = await createDeviceWithSensors(deviceData, sensorData);
                console.log(`Sensor ${newSensor.name} created for device ${device.deviceName}`);
              } catch (sensorError) {
                console.error('Error creating sensor:', sensorError);
              }
            }
          }

          // Fetch the updated device with sensors
          const updatedDevice = await Device.findById(device._id).populate('sensors');
          socket.emit(EventTypes.DEVICE_EXISTS, [false, updatedDevice.toObject()]);
        }
      } catch (error) {
        console.error('Error checking/creating device:', error);
        socket.emit(EventTypes.DEVICE_EXISTS, [false, null]);
      }
    });

    socket.on(EventTypes.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      clientRooms[socket.id] = roomId;
      if (clientType === 'desktop') {
        roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;
        if (roomCounts[roomId] === 1) {
          // Notify devices in this room that a desktop client has connected
          io.to(roomId).emit(EventTypes.DESKTOP_CONNECTED);
        }
      }
      console.log(`${clientType} client ${socket.id} joined room ${roomId}`);
    });

    socket.on(EventTypes.SEND_DATA, (data) => {
      const { roomId, ...rest } = data;
      io.to(roomId).emit(EventTypes.RECEIVE_DATA, rest);
    });

    socket.on(EventTypes.SEND_DATA_TO_DB, async (data) => {
      try {
        const { cpuUsage, time, roomId } = data;
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const timestamp = new Date();
        timestamp.setHours(hours, minutes, seconds);

        const { createMeasurement } = new MeasurementService();
        console.log('Creating measurement:', data);
        await createMeasurement({
          value: cpuUsage,
          metadata: { sensorId: roomId },
          timestamp: timestamp
        });

        console.log('Data sent to the database:', data);
      } catch (error) {
        console.error('Error sending data to the database:', error);
      }
    });

    socket.on(EventTypes.DISCONNECT, () => {
      console.log(`A client disconnected: ${socket.id}`);
      const roomId = clientRooms[socket.id];
      if (clientType === 'desktop' && roomId) {
        roomCounts[roomId] = Math.max((roomCounts[roomId] || 1) - 1, 0);
        if (roomCounts[roomId] === 0) {
          // Notify devices in this room that all desktop clients have disconnected
          io.to(roomId).emit(EventTypes.DESKTOP_DISCONNECTED);
        }
      }
      delete clientRooms[socket.id];
    });
  });

  return io;
}