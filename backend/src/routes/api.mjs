import express from "express";
import deviceRouter from "./device.routes.mjs";
import yup from 'yup'
import userRouter from "./user.routes.mjs";

const api = express.Router()

api.use('/device', deviceRouter)
api.use('/user', userRouter)

export default api