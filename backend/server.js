import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import seedAdminFromEnv from './src/utils/seedAdmin.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdminFromEnv();

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
});
