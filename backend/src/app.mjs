import express from 'express'
import api from './routes/api.mjs'
import { errorHandler } from './utils/middlewares.mjs'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import compression from 'compression'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  console.log('prod')
  dotenv.config({ path: path.resolve(__dirname, '.env.production') })
} else {
  console.log('dev')
  dotenv.config({ path: path.resolve(__dirname, '.env.development') })
}

const app = express()
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(cors({ origin: '*' }))
app.use(compression());
app.use(express.json())

// Serve the frontend build files
app.use(express.static(path.join(__dirname, '..', 'build')))

app.use('/v1', api)

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.use(errorHandler)

export default app