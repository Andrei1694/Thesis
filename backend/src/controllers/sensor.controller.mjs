import { createSensor, getSensors, getSensor, updateSensor, deleteSensor, getSensorsByDevice } from "../services/sensor.service.mjs";
import * as Yup from "yup";


const createSensorSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").max(25, "Name must be at most 25 characters").required("Name is required"),
    description: Yup.string().min(2, "Description must be at least 2 characters").max(25, "Description must be at most 25 characters").required("Description is required"),
    type: Yup.string().min(2, "Type must be at least 2 characters").max(25, "Type must be at most 25 characters").required("Type is required"),
    unit: Yup.string().min(2, "Unit must be at least 2 characters").max(25, "Unit must be at most 25 characters").required("Unit is required"),

});

const updateSensorSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").max(25, "Name must be at most 25 characters"),
    description: Yup.string().min(2, "Description must be at least 2 characters").max(25, "Description must be at most 25 characters"),
    type: Yup.string().min(2, "Type must be at least 2 characters").max(25, "Type must be at most 25 characters"),
    unit: Yup.string().min(2, "Unit must be at least 2 characters").max(25, "Unit must be at most 25 characters"),
});

async function httpCreateSensor(req, res) {
    const { deviceId } = req.body
    if (!deviceId) {
        return res.status(400).json({ message: 'Missing device id' })
    }
    try {
        const sensorData = await createSensorSchema.validate(req.body, { abortEarly: false });
        const sensor = await createSensor(sensorData, deviceId);
        return res.status(201).json(sensor);
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function httpGetSensorsByDevice(req, res) {
    const { deviceId } = req.params
    if (!deviceId) {
        return res.status(400).json({ message: 'Missing deviceId' })
    }
    try {
        const sensors = await getSensorsByDevice(deviceId)
        return res.status(200).json(sensors)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function httpGetSensors(req, res) {
    try {
        const sensors = await getSensors()
        return res.status(200).json(sensors)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function httpGetSensor(req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'Missing id' })
    }
    try {
        const sensor = await getSensor(id)
        return res.status(200).json(sensor)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function httpUpdateSensor(req, res) {
    const { id } = req.params
    const { name, description, type, unit } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Missing id' })
    }

    try {
        const sensorData = await updateSensorSchema.validate(req.body, { abortEarly: false });
        const sensor = await updateSensor(id, sensorData);
        return res.status(200).json(sensor);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function httpDeleteSensor(req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'Missing id' })
    }
    try {
        const sensor = await deleteSensor(id)
        return res.status(200).json(sensor)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export {
    httpCreateSensor,
    httpGetSensors,
    httpGetSensor,
    httpUpdateSensor,
    httpDeleteSensor,
    httpGetSensorsByDevice
}