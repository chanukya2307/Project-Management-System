import express from 'express';
import { body } from 'express-validator';
import { getMe, login, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

export default router;
