import mongoose from 'mongoose'

const measurmentSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    metadata: {
        sensorId: {
            type: String,
            required: true
        }
    }
}, {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds',
    }
})

measurmentSchema.methods.toJSON = function () {
    var obj = this.toObject();
    const { __v, ...rest } = obj
    return rest;
}

measurmentSchema.index({ index: 1 })

export default mongoose.model('Measurment', measurmentSchema)
