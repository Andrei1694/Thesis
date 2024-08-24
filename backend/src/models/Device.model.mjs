import mongoose from 'mongoose'

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
    manufacturer: String

}, { timestamps: true })

deviceSchema.methods.toJSON = function () {
    var obj = this.toObject();
    const { __v, ...rest } = obj
    return rest;
}
const Device = mongoose.model('Device', deviceSchema)

export default Device
