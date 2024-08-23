
const SensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Sensor = mongoose.model('Sensor', SensorSchema);

export async function createSensor(data) {
    if (!data) {
        throw Error('No data provided')
    }
    const newSensor = new Sensor({
        ...data
    })
    try {
        await newSensor.save()
    } catch (error) {
        console.log(error)
    }
}

export async function getSensors() {
    const sensors = await Sensor.find({})
    return sensors
}

export async function getSensor(id) {
    const sensor = await Sensor.find(id)
    if (!sensor) {
        throw Error('No sensor found with this id')
    }
    return sensor
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

export async function deleteSensor(id) {
    if (!id) {
        throw Error('No id provided')
    }
    const sensor = await Sensor.findByIdAndDelete(id)
    return sensor
}

