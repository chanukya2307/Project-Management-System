import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  department: user.department,
  phone: user.phone,
  role: user.role
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, jobTitle, department, phone } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    jobTitle,
    department,
    phone,
    role: 'member'
  });
  res.status(201).json({
    user: sanitizeUser(user),
    token: generateToken(user._id)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id)
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
