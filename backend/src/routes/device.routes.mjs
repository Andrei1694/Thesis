import express from "express";

import { generateProjection, generatePagination } from "../utils/middlewares.mjs";
import { httpGetDevicesPaginated, httpFindDeviceById, httpCreateNewDevice, httpUpdateDevice, httpDeleteDevice, httpSearchDevice } from "../controllers/device.controller.mjs";

const deviceRouter = express.Router()

deviceRouter.get('/', generateProjection, generatePagination, httpGetDevicesPaginated)
deviceRouter.get('/search', generatePagination, httpSearchDevice)
deviceRouter.get('/:id', httpFindDeviceById)



deviceRouter.post('/', httpCreateNewDevice)

deviceRouter.patch('/:id', httpUpdateDevice)

deviceRouter.delete('/:id', httpDeleteDevice)

export default deviceRouter