import http from 'http'
import app from './app.mjs'
import { mongoConnect } from './utils/mongoose.mjs'
// import socketConnect from './socket.mjs'
import SocketIOService from './services/io.service.mjs'
import os from 'os'

const PORT = process.env.PORT || 3000

const server = http.createServer(app)
const socketIOService = new SocketIOService(server);

const getLocalIP = () => {
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = [];
    for (const networkInterface in networkInterfaces) {
        if (networkInterfaces.hasOwnProperty(networkInterface)) {
            const networkInterfaceAddresses = networkInterfaces[networkInterface];
            for (const networkInterfaceAddress of networkInterfaceAddresses) {
                if (networkInterfaceAddress.family === 'IPv4' && networkInterfaceAddress.internal === false) {
                    ipAddresses.push(networkInterfaceAddress.address);
                }
            }
        }
    }
    return ipAddresses[0];
}

async function startServer() {
    await mongoConnect();

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running at http://${getLocalIP()}:${PORT}/`);
        console.log(`Server running at http://0.0.0.0:${PORT}/`);
        console.log(`For local access, use: http://localhost:${PORT}/`);
        console.log(`For LAN access, use: http://<Your-IP-Address>:${PORT}/`);
    });
}

startServer();