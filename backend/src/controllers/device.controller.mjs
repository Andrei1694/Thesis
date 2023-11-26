import Device from "../models/Device.model.mjs";

export async function httpGetDevicesPaginated(req, res, next) {
    const { page, limit } = req.pagination;
    const { sortBy } = req.query
    try {

        const sort = {}
        if (sortBy) {
            console.log(sortBy)
            const parts = sortBy.split(":")
            // console.log(parts[0], parts[1])
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const devices = await Device.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sort)

        const total = await Device.countDocuments();

        return res.status(200).json({ data: devices, total });
    } catch (error) {
        next(error)
    }
}

export async function httpFindDeviceById(req, res, next) {
    const { id } = req.params;
    try {
        const device = await Device.findById(id);

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }

        res.status(200).json({ device });
    } catch (error) {
        next(error)
    }
}

export async function httpCreateNewDevice(req, res, next) {
    try {
        const newDevice = new Device(req.body);
        const savedDevice = await newDevice.save();

        return res.status(201).json({ device: savedDevice });
    } catch (error) {
        next(error)
    }
}

export async function httpUpdateDevice(req, res, next) {
    const { id } = req.params;
    try {
        const device = await Device.findById(id);

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ['location']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        const updatedDevice = await Device.findByIdAndUpdate(id, req.body, { new: true });

        return res.status(200).json({ device: updatedDevice });
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export async function httpDeleteDevice(req, res, next) {
    const { id } = req.params;
    console.log(id)
    try {
        const device = await Device.findByIdAndDelete(id);

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }
        return res.status(204).end(); // No content
    } catch (error) {
        next(error)
    }
}

export async function httpSearchDevice(req, res, next) {
    const { searchTerm } = req.query
    const { limit } = req.pagination
    try {
        const devices = await Device.find({ deviceName: { $regex: searchTerm, $options: 'i' } }).limit(limit);
        const total = await Device.countDocuments()
        return res.status(200).json({ devices, total })
    } catch (error) {
        next(error)
    }
}