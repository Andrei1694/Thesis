import mongoose from 'mongoose';
import faker from 'faker';
import Device from '../src/models/Device.model.mjs';
import { User } from '../src/services/user.service.mjs';

async function seedDatabase() {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb://localhost:6001/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const totalDevices = 50;
    const totalUsers = 20;

    // Seed Devices
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

    // Seed Users
    for (let i = 0; i < totalUsers; i++) {
        const fakeUser = new User({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(12),
            active: faker.datatype.boolean(),
            admin: faker.datatype.boolean(0.1), // 10% chance of being an admin
            tokens: [{ token: faker.datatype.uuid() }],
        });

        await fakeUser.save();
        console.log(`User ${i + 1} created.`);
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