import { io } from 'socket.io-client'
import { cpuUsage } from 'os-utils';

const URL = 'http://localhost:4000'
const deviceName = "asdasd"

// 1. When the device (client) connects to the server, it should join a room with its own name. 
// This room will be used to identify the device and broadcast data to the connected desktop clients.
// 2. The device will emit the data to the server, specifying the room name.
// 3. On the server-side, you can listen for the data emission event and broadcast the received data to all the clients connected to the device's room, excluding the device itself.
// 4. The desktop clients can join the device's room to receive the broadcasted data
// emitting events to a room with no connected clients can result in unnecessary network traffic and processing overhead on the server side
function createSocketService(url, streamInterval = 1000) {
    const socket = io(url, {
        query: { clientType: 'device' }
    });
    let interval = null
    const { CONNECT, DISCONNECT, STOP_STREAMING, START_STREAMING } = {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        STOP_STREAMING: 'STOP_STREAMING',
        START_STREAMING: 'START_STREAMING',
        JOIN_ROOM: 'JOIN_ROOM',
        SEND_DATA: 'SEND_DATA'
    }

    console.log('======Start=====');

    socket.on(CONNECT, () => {
        console.log('Connected to the backend server');
        // Join the room with the device name
        socket.emit('JOIN_ROOM', deviceName);
    });

    socket.on(STOP_STREAMING, () => {
        interval = null
        clearInterval(interval)
    })

    socket.on(START_STREAMING, () => {
        console.log('[DEVICE] Streaming Started')
        interval = setInterval(() => {
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const seconds = currentTime.getSeconds().toString().padStart(2, "0");
            const date = `${hours}:${minutes}:${seconds}`;
            cpuUsage((cpuUsage) => {
                socket.emit("SEND_DATA", { cpuUsage, date, roomId: deviceName });
            });
        }, streamInterval);

    })
    socket.on(STOP_STREAMING, () => {
        console.log("Streaming stopped");
        clearInterval(interval);
        interval = null;
    });
    socket.on(DISCONNECT, () => {
        console.log('Disconnected from the backend server');
    });
}

createSocketService(URL, 5000)

