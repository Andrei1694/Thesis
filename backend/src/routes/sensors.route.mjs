import Express from 'express'

const sensorRouter = Express.Router()
import { httpCreateSensor, httpGetSensors, httpGetSensor, httpUpdateSensor, httpDeleteSensor } from '../controllers/sensor.controller.mjs'

sensorRouter.post('/sensors', httpCreateSensor)
sensorRouter.get('/sensors', httpGetSensors)
sensorRouter.get('/sensors/:id', httpGetSensor)
sensorRouter.put('/sensors/:id', httpUpdateSensor)
sensorRouter.delete('/sensors/:id', httpDeleteSensor)

module.exports = sensorRouter