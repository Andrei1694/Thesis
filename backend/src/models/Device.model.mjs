import mongoose from 'mongoose'

const deviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        min: 3,
        max: 25,
        required: true,
        index: true
    },
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

export default mongoose.model('Device', deviceSchema)
