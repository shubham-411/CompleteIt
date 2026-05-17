const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await User.deleteMany();

    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'password123',
        role: 'Admin',
        department: 'HR'
    });

    const manager = await User.create({
        name: 'Manager User',
        email: 'manager@company.com',
        password: 'password123',
        role: 'Manager',
        department: 'Engineering'
    });

    const employee = await User.create({
        name: 'Employee User',
        email: 'emp@company.com',
        password: 'password123',
        role: 'Employee',
        department: 'Engineering',
        managerId: manager._id
    });

    console.log('Seeded Users: admin@company.com, manager@company.com, emp@company.com (pwd: password123)');
    process.exit(0);
};
seedDB();
