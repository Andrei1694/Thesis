import Express from 'express'

import { httpGetSensors, httpGetSensor, httpUpdateSensor, httpDeleteSensor, httpCreateSensor, httpGetSensorsByDevice } from '../controllers/sensor.controller.mjs'

const sensorRouter = new Express.Router()
sensorRouter.post('/', httpCreateSensor)
sensorRouter.get('/', httpGetSensors)
sensorRouter.get('/:id', httpGetSensor)
sensorRouter.post('/device', httpGetSensorsByDevice)
sensorRouter.put('/:id', httpUpdateSensor)
sensorRouter.delete('/:id', httpDeleteSensor)

export default sensorRouter