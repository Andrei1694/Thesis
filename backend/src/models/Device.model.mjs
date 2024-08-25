import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const deviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        min: 3,
        max: 25,
        required: true,
        index: true
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    }],
    description: String,
    location: String,
    country: String,
    ipAddress: String,
    serialNumber: String,
    manufacturer: String,
    key: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 25,
    }

}, { timestamps: true })

deviceSchema.methods.toJSON = function () {
    var obj = this.toObject();
    const { __v, ...rest } = obj
    return rest;
}

deviceSchema.pre('save', function (next) {
    try {
        const device = this;
        device.key = bcrypt.hash(device.deviceName, 10);
        next();
    } catch (error) {
        console.error('Error hashing device name:', error);
    }
})
const Device = mongoose.model('Device', deviceSchema)

export default Device
