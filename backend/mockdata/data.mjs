import mongoose from 'mongoose';
import faker from 'faker';
import Device from '../src/models/Device.model.mjs';

async function seedDatabase() {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb://localhost:6001/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const totalDevices = 50; // Change this to the number of devices you want to create

    for (let i = 0; i < totalDevices; i++) {
        const fakeDevice = new Device({
            deviceName: faker.random.word(),
            description: faker.lorem.sentence(),
            location: faker.address.city(),
            country: faker.address.country(),
            ipAddress: faker.internet.ip(),
            serialNumber: faker.datatype.uuid(),
            manufacturer: faker.company.companyName(),
        });

        await fakeDevice.save();
        console.log(`Device ${i + 1} created.`);
    }

    console.log('Data seeding complete.');
}

seedDatabase()
    .then(() => {
        mongoose.disconnect();
    })
    .catch((error) => {
        console.error('Error seeding data:', error);
    });
