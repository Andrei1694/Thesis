import express from "express";
import deviceRouter from "./device.routes.mjs";
import yup from 'yup'

const api = express.Router()

api.use('/device', deviceRouter)

export default api