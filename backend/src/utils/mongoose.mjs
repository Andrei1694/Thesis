import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../', '.env') });

let MONGO_URL = null
if (process.env.NODE_ENV === 'development') {
    console.log('dev mode')
    MONGO_URL = `${process.env.MONGO_URI}?directConnection=true&serverSelectionTimeoutMS=2000`
    console.log(process.env.MONGO_URI)
} else {
    console.log('production mode')
    MONGO_URL = `${process.env.MONGO_URI}?directConnection=true&serverSelectionTimeoutMS=2000authSource=admin`
    console.log(MONGO_URL)
}


mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

export async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
    await mongoose.disconnect();
}

