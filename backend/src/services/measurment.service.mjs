import MeasurmentModel from "../models/Measurment.model.mjs";

export default function MeasurmentService() {
    async function createMeasurement(data) {
        if (!data) {
            throw Error('No data provided')
        }
        const newMeasure = new MeasurmentModel({
            ...data
        })
        try {
            await newMeasure.save()
        } catch (error) {
            console.log(error)
        }
    }
    return {
        createMeasurement
    }
}