import http from 'http'
import app from './app.mjs'
import { mongoConnect } from './utils/mongoose.mjs'
// import socketConnect from './socket.mjs'
import SocketIOService from './services/io.service.mjs'

const PORT = process.env.PORT || 3000

const server = http.createServer(app)
const socketIOService = new SocketIOService(server);

async function startServer() {
    await mongoConnect();

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();