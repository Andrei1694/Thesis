import { Server } from 'socket.io'
import cors from 'cors';
import { cpuUsage } from 'os-utils';
import MeasurmentService from './measurment.service.mjs';

const CONNECTION = "connection"
const DISCONNECT = "disconnect"
const CPU_USAGE = "cpu_usage"
const DEVICE_IS_ONLINE = 'DEVICE_IS_ONLINE'
const START_STREAMING = "START_STREAMING"
const STOP_STREAMING = "STOP_STREAMING"


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

        io.emit(DEVICE_IS_ONLINE, { online: true })
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
                const measurment = new MeasurmentService()
                measurment.createMeasurment({
                    timestamp: new Date(),
                    value: cpuUsage,
                    metadata: {
                        sensorId: 'sensor123',
                        location: 'Room A',
                        unit: 'Celsius'
                    }
                })
            });

        }, time);

        return interval;
    }
    function stopMeasurment(interval) {
        clearInterval(interval)
    }
    io.on(CONNECTION, (socket) => {
        console.log(`A client connected ${socket.id}`)
        let interval = null
        // Clear the previous interval if it exists
        // if (interval) {
        //     clearInterval(interval);
        // }

        socket.on(START_STREAMING, (data) => {
            if (interval) return
            console.log(data)
            const { time } = data ?? {}
            console.log(time)
            interval = sendMeasurement(socket, time);
        })
        socket.on(STOP_STREAMING, () => {
            interval = clearInterval(interval)
        })
        socket.on(DISCONNECT, () => {
            console.log('A client disconnected');
            clearInterval(interval);
        });
    })
    return { io, emitDeviceIsOnline, ceva }
}