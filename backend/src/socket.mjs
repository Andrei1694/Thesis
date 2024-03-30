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
    socket.on('startRecord', (requestObject) => {
      if(!requestObject) return
      const { samplingTime } = requestObject ?? {}
      console.log('get') 
      console.log(samplingTime)
       // Start a new interval to emit CPU usage every 10 seconds
       if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
      cpuUsage((cpuUsage) => {
        console.log(samplingTime)
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const name = `${hours}:${minutes}:${seconds}`;
        socket.emit('cpuUsage', {cpuUsage,name});
      });
    }, samplingTime);
    })

    socket.on('disconnect', () => {
      console.log('A client disconnected');
      clearInterval(interval);
    });
  });

  return io;
}