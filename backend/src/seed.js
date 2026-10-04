const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Expense = require('./models/Expense');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Expense.deleteMany({});

    console.log('Cleared existing users and expenses.');

    // Create User A (Ajit Singh)
    const userA = await User.create({
      name: 'Ajit Singh',
      email: 'ajit@example.com',
      password: 'password123',
    });

    // Create User B (User B - for testing isolation)
    const userB = await User.create({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123',
    });

    console.log('Users created: Ajit Singh & User B');

    // Create sample expenses for Ajit Singh
    const expensesA = [
      {
        user: userA._id,
        amount: 250,
        category: 'Food',
        date: new Date('2026-10-04T12:30:00Z'),
        note: 'Lunch with friends at cafe',
      },
      {
        user: userA._id,
        amount: 50,
        category: 'Travel',
        date: new Date('2026-10-03T09:15:00Z'),
        note: 'Train ticket',
      },
      {
        user: userA._id,
        amount: 799,
        category: 'Shopping',
        date: new Date('2026-10-02T16:45:00Z'),
        note: 'Cotton T-shirt',
      },
      {
        user: userA._id,
        amount: 1500,
        category: 'Bills',
        date: new Date('2026-10-01T10:00:00Z'),
        note: 'Electricity bill payment',
      },
      {
        user: userA._id,
        amount: 600,
        category: 'Entertainment',
        date: new Date('2026-09-28T19:00:00Z'),
        note: 'Movie night tickets',
      },
      {
        user: userA._id,
        amount: 450,
        category: 'Health',
        date: new Date('2026-10-03T18:00:00Z'),
        note: 'Pharmacy vitamins',
      },
      {
        user: userA._id,
        amount: 1200,
        category: 'Education',
        date: new Date('2026-09-25T11:00:00Z'),
        note: 'Online course subscription',
      },
      {
        user: userA._id,
        amount: 300,
        category: 'Food',
        date: new Date('2026-10-01T20:00:00Z'),
        note: 'Dinner takeaway',
      },
    ];

    // Create sample expenses for User B (User B's private data)
    const expensesB = [
      {
        user: userB._id,
        amount: 9999,
        category: 'Shopping',
        date: new Date('2026-10-04T10:00:00Z'),
        note: "User B's Private Laptop Accessory",
      },
    ];

    await Expense.insertMany([...expensesA, ...expensesB]);
    console.log('Sample expenses seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
