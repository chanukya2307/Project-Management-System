import User from '../models/User.js';

const seedAdminFromEnv = async () => {
  const {
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_RESET_PASSWORD
  } = process.env;

  if (!ADMIN_NAME && !ADMIN_EMAIL && !ADMIN_PASSWORD) return;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are all required to seed an admin');
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existingUser = await User.findOne({ email }).select('+password');

  if (existingUser) {
    existingUser.name = ADMIN_NAME;
    existingUser.role = 'admin';

    if (ADMIN_RESET_PASSWORD === 'true') {
      existingUser.password = ADMIN_PASSWORD;
    }

    await existingUser.save();
    console.log(`Admin user ready: ${email}`);
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email,
    password: ADMIN_PASSWORD,
    role: 'admin'
  });

  console.log(`Admin user created: ${email}`);
};

export default seedAdminFromEnv;
