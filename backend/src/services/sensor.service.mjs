import mongoose from "mongoose";
import Device from "../models/Device.model.mjs"

const SensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 25,
        minLength: 2,

    },
    description: {
        type: String,
        required: true,
        maxLength: 250,
        minLength: 2,
    },
    type: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        maxLength: 25,
        minLength: 2,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Sensor = mongoose.model('Sensor', SensorSchema);

export async function createSensor(data, deviceId) {
    if (!data || !deviceId) {
        throw new Error('Sensor data and device ID are required');
    }
    let newSensor = null;
    try {
        // Create the new sensor
        newSensor = new Sensor(data);
        await newSensor.save();

        // Update the device with the new sensor ID
        const updatedDevice = await Device.findByIdAndUpdate(
            deviceId,
            { $push: { sensors: newSensor._id } },
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            // If device update fails, delete the sensor to maintain consistency
            await Sensor.findByIdAndDelete(newSensor._id);
            throw new Error('Device not found');
        }

        return newSensor;
    } catch (error) {
        // If any error occurs during sensor creation or device update, ensure the sensor is deleted
        if (newSensor && newSensor._id) {
            await Sensor.findByIdAndDelete(newSensor._id);
        }
        throw error;
    }
}
export async function getSensors() {
    const sensors = await Sensor.find({})
    return sensors
}

export async function getSensor(id) {
    const sensor = await Sensor.findById(id);
    if (!sensor) {
        throw new Error('No sensor found with this id');
    }
    return sensor;
}
export async function getSensorsByDevice(deviceId) {
    try {
        // Fetch the device
        const device = await Device.findById(deviceId);
        if (!device) {
            throw new Error('Device not found');
        }

        console.log('Original device sensors array:', device.sensors);

        // Fetch existing sensors
        const existingSensors = await Sensor.find({ _id: { $in: device.sensors } });

        console.log('Existing sensors:', existingSensors);

        // Find IDs of deleted sensors
        const deletedSensorIds = device.sensors.filter(id =>
            !existingSensors.some(sensor => sensor._id.equals(id))
        );

        if (deletedSensorIds.length > 0) {
            console.log('Deleted sensor IDs:', deletedSensorIds);

            // Remove deleted sensor IDs from the device
            device.sensors = device.sensors.filter(id =>
                !deletedSensorIds.some(deletedId => deletedId.equals(id))
            );

            // Save the updated device
            await device.save();

            console.log('Updated device sensors array:', device.sensors);
        }

        return existingSensors;
    } catch (error) {
        console.error('Error in getSensorsByDevice:', error);
        throw error;
    }
}

export async function updateSensor(id, data) {
    if (!id) {
        throw Error('No id provided')
    }
    if (!data) {
        throw Error('No data provided')
    }
    const sensor = await Sensor.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
    return sensor
}

export async function createDeviceWithSensors(deviceData, sensorsData) {
    try {
        console.log('Creating new device with data:', JSON.stringify(deviceData, null, 2));
        const newDevice = new Device(deviceData);
        await newDevice.save();
        console.log('New device created:', newDevice._id.toString());

        console.log('Creating sensors:', JSON.stringify(sensorsData, null, 2));
        const createdSensors = await Promise.all(sensorsData.map(async (sensorData) => {
            const newSensor = new Sensor({
                ...sensorData,
                device: newDevice._id
            });
            await newSensor.save();
            console.log('New sensor created:', newSensor._id.toString());
            return newSensor;
        }));

        newDevice.sensors = createdSensors.map(sensor => sensor._id);
        await newDevice.save();

        console.log('Device and sensors created successfully');

        const populatedDevice = await Device.findById(newDevice._id).populate('sensors');
        console.log('Populated device:', JSON.stringify(populatedDevice, null, 2));

        return populatedDevice;
    } catch (error) {
        Device.findByIdAndDelete(newDevice._id);
        console.error('Error in createDeviceWithSensors:', error);
        throw error;
    }
}
export async function deleteSensor(id) {
    if (!id) {
        throw new Error('Sensor ID is required');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sensor = await Sensor.findByIdAndDelete(id).session(session);
        if (!sensor) {
            throw new Error('Sensor not found');
        }

        await Device.updateMany(
            { sensors: sensor._id },
            { $pull: { sensors: sensor._id } }
        ).session(session);

        await session.commitTransaction();
        return sensor;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

