import express from 'express'
import api from './routes/api.mjs'
import { errorHandler } from './utils/middlewares.mjs'
import cors from 'cors'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/v1', api)
app.use(errorHandler)

export default app