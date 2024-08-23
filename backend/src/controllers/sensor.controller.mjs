async function httpCreateSensor(req, res) {
    const { name, description, type, unit } = req.body
    if (!name || !description || !type || !unit) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    try {
        const sensor = await createSensor({ name, description, type, unit })
        return res.status(201).json(sensor)
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
    if (!name || !description || !type || !unit) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    try {
        const sensor = await updateSensor(id, { name, description, type, unit })
        return res.status(200).json(sensor)
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

export default {
    httpCreateSensor,
    httpGetSensors,
    httpGetSensor,
    httpUpdateSensor,
    httpDeleteSensor
}