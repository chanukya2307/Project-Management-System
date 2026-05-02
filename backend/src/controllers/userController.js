import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email role createdAt')
    .sort({ name: 1 });

  res.json({ users });
});
