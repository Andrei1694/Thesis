import { Server } from 'socket.io'
import cors from 'cors';

import MeasurmentService from './measurment.service.mjs';

const CONNECTION = "connection"
const DISCONNECT = "disconnect"
const CPU_USAGE = "cpu_usage"
const DEVICE_IS_ONLINE = 'DEVICE_IS_ONLINE'
const START_STREAMING = "START_STREAMING"
const STOP_STREAMING = "STOP_STREAMING"
const JOIN_ROOM = "JOIN_ROOM"

export default function SocketIOService(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    const roomCounts = {}
    io.on(CONNECTION, (socket) => {
        console.log(`A client connected ${socket.id}`)
        const clientType = socket.handshake.query.clientType;
        socket.on('JOIN_ROOM', (roomId) => {
            socket.join(roomId);
            console.log(`${clientType} client ${socket.id} joined room ${roomId}`);
            // if (clientType === 'device') set isDeviceOnline true
            if (clientType === 'desktop') {
                console.log('aici')
                // Increment the count of desktop clients in the room
                if (!roomCounts[roomId]) {
                    roomCounts[roomId] = 1;
                } else {
                    roomCounts[roomId]++;
                }

                // Emit an event to the device to start streaming if this is the first desktop client
                if (roomCounts[roomId] === 1) {
                    io.to(roomId).emit('START_STREAMING');
                }
            }
        });
        socket.on('SEND_DATA', (data) => {
            const { roomId, ...rest } = data;
            socket.to(roomId).emit('RECEIVE_DATA', rest);
        });

        socket.on('disconnecting', () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach((roomId) => {
                if (socket.handshake.query.clientType === 'desktop') {
                    roomCounts[roomId]--;

                    // Emit an event to the device to stop streaming if this is the last desktop client
                    if (roomCounts[roomId] === 0) {
                        io.to(roomId).emit('STOP_STREAMING');
                    }
                }
            });
        });
    })
    return { io }
}