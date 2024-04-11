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
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const seconds = currentTime.getSeconds().toString().padStart(2, "0");
            const date = `${hours}:${minutes}:${seconds}`;
            cpuUsage((cpuUsage) => {
                socket.emit(CPU_USAGE, { cpuUsage, date });
            });
        }, time);

        return interval;
    }
    function stopMeasurment(interval) {
        clearInterval(interval)
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
        let interval = null
        socket.on("START", (data) => {
            console.log(data)
            const { time } = data ?? {}
            console.log(time)
            interval = sendMeasurement(socket, time);
        })
        socket.on("STOP", () => {
            clearInterval(interval)
        })
        socket.on(DISCONNECT, () => {
            console.log('A client disconnected');
            clearInterval(interval);
        });
    })
    return { io, emitDeviceIsOnline, ceva }
}