import express from "express";

import { generateProjection, generatePagination, auth } from "../utils/middlewares.mjs";
import { httpGetDevicesPaginated, httpFindDeviceById, httpCreateNewDevice, httpUpdateDevice, httpDeleteDevice, httpSearchDevice } from "../controllers/device.controller.mjs";

const deviceRouter = express.Router()

deviceRouter.get('/', auth, generateProjection, generatePagination, httpGetDevicesPaginated)
deviceRouter.get('/search', auth, generatePagination, httpSearchDevice)
deviceRouter.get('/:id', auth, httpFindDeviceById)



deviceRouter.post('/', auth, httpCreateNewDevice)

deviceRouter.patch('/:id', auth, httpUpdateDevice)

deviceRouter.delete('/:id', auth, httpDeleteDevice)

export default deviceRouter