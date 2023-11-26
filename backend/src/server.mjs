import http from 'http'
import app from './app.mjs'
import dotenv from 'dotenv'
import { mongoConnect } from './utils/mongoose.mjs'

const PORT = process.env.PORT || 3000


const server = http.createServer(app)

async function startServer() {
    await mongoConnect();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();