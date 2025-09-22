require('dotenv').config();
const { connectToDatabase } = require('../utils/db');
const User = require('../models/User');

async function seedAdmin() {
  await connectToDatabase();
  const email = process.env.ADMIN_EMAIL || 'admin@pk36.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrator';

  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await User.hashPassword(password);
    user = await User.create({ email, name, passwordHash, role: 'admin' });
    console.log('Created admin user:', email);
  } else {
    console.log('Admin user already exists:', email);
  }
  process.exit(0);
}

seedAdmin();


