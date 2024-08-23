import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../services/user.service.mjs';
import Device from '../models/Device.model.mjs';

const MONGODB_URI = 'mongodb://localhost:6001/test'; // Replace with your MongoDB URI
const NUM_USERS = 50; // Number of sample users to create
const NUM_DEVICES = 50; // Number of sample devices to create

async function generateRandomUser() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(faker.internet.password(), salt);

    return {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: hashedPassword,
        active: faker.datatype.boolean({ probability: 0.8 }), // 80% chance of being active
        admin: faker.datatype.boolean({ probability: 0.1 }), // 10% chance of being admin
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
}

function generateRandomDevice() {
    return {
        deviceName: faker.lorem.words({ min: 1, max: 3 }),
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        country: faker.location.country(),
        ipAddress: faker.internet.ip(),
        serialNumber: faker.string.alphanumeric(10).toUpperCase(),
        manufacturer: faker.company.name()
    };
}

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users and devices
        await User.deleteMany({});
        await Device.deleteMany({});
        console.log('Cleared existing users and devices');

        // Generate and insert new users
        const userPromises = Array.from({ length: NUM_USERS }, async () => {
            const userData = await generateRandomUser();
            return new User(userData).save();
        });

        // Generate and insert new devices
        const devicePromises = Array.from({ length: NUM_DEVICES }, () => {
            const deviceData = generateRandomDevice();
            return new Device(deviceData).save();
        });

        // Wait for all insertions to complete
        await Promise.all([...userPromises, ...devicePromises]);

        console.log(`${NUM_USERS} sample users and ${NUM_DEVICES} sample devices have been created`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedDatabase();