import express from 'express'
import api from './routes/api.mjs'
import { errorHandler } from './utils/middlewares.mjs'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import compression from 'compression'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(compression());
app.use(express.json())

// Serve the frontend build files
app.use(express.static(path.join(__dirname, '..', 'build')))

app.use('/v1', api)

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'build', 'index.html'));
  });
  
app.use(errorHandler)

export default app