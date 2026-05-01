const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetUsers = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/uraiyadal');
        
        // 1. List existing users
        const existingUsers = await User.find({}, 'username');
        console.log('Existing users found:', existingUsers.map(u => u.username).join(', '));

        // 2. Delete unwanted users
        console.log('Cleaning up old accounts...');
        await User.deleteMany({ 
            username: { $in: ['adhi', 'adhisgankaran', 'adhi123', 'adhi456', 'adhi41'] } 
        });

        // 3. Create new master user
        const username = 'Adhishankaran';
        const password = 'pass@1234';
        
        const userExists = await User.findOne({ username });
        if (userExists) {
            await User.deleteOne({ username });
            console.log('Removed old Adhishankaran account to reset password.');
        }

        await User.create({
            name: 'Adhishankaran',
            username: username,
            password: password
        });

        console.log('✅ SUCCESS!');
        console.log(`User created: ${username}`);
        console.log(`Password: ${password}`);
        
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

resetUsers();
