const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing users and indexes to avoid conflicts
        await User.deleteMany({});
        await User.collection.dropIndexes();

        const users = [
            {
                name: 'Adhi',
                username: 'adhi123',
                email: 'adhi@gmail.com',
                password: 'pass@1234',
                isVerified: true
            },
            {
                name: 'Adhishankaran',
                username: 'adhi456',
                email: 'adhishankaran@gmail.com',
                password: 'pass@1234',
                isVerified: true
            }
        ];

        for (let u of users) {
             // We hash it manually or let the model handle it
             await User.create(u);
             console.log(`Created user: ${u.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedUsers();
