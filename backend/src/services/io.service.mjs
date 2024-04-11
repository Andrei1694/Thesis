import { Server } from 'socket.io'
import cors from 'cors';
import { cpuUsage } from 'os-utils';

const CONNECTION = "connection"
const DISCONNECT = "disconnect"
const CPU_USAGE = "cpu_usage"
const DEVICE_IS_ONLINE = 'DEVICE_IS_ONLINE'
const START_STREAMING = "START_STREAMING"
const STOP_STREAMING = "STOP_STREAMING"
let interval = null;

export default function SocketIOService(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    function ceva() {
        console.log("HOO")
    }
    //TODO
    function emitDeviceIsOnline() {
        console.log("TRIIGER")
        io.emit(DEVICE_IS_ONLINE, { online: true })
    }
    function ceva() {
        console.log("dsasda")
    }
    function sendMeasurement(socket, time = 1000) {
        let interval = setInterval(() => {
            cpuUsage((cpuUsage) => {
                socket.emit(CPU_USAGE, cpuUsage);
            });
        }, time);

        return interval;
    }
    io.on(CONNECTION, (socket) => {
        console.log(`A client connected ${socket.id}`)

        // Clear the previous interval if it exists
        // if (interval) {
        //     clearInterval(interval);
        // }
        // Start a new interval to emit CPU usage every 10 seconds
        // interval = setInterval(() => {
        //     cpuUsage((cpuUsage) => {
        //         socket.emit(CPU_USAGE, cpuUsage);
        //     });
        // }, 1000);
        // Start a new interval to emit CPU usage every 10 seconds
        const interval = sendMeasurement(socket, 5000);
        socket.on(DISCONNECT, () => {
            console.log('A client disconnected');
            clearInterval(interval);
        });
    })
    return { io, emitDeviceIsOnline, ceva }
}