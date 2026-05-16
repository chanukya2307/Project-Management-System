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
    body('jobTitle').optional({ values: 'falsy' }).trim().isLength({ max: 80 }).withMessage('Job title is too long'),
    body('department').optional({ values: 'falsy' }).trim().isLength({ max: 80 }).withMessage('Department is too long'),
    body('phone').optional({ values: 'falsy' }).trim().isMobilePhone('any').withMessage('Enter a valid phone number'),
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
