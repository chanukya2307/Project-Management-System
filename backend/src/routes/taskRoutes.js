import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { isTodayOrFuture } from '../utils/dateValidators.js';

const router = express.Router();

const createTaskValidators = [
  body('title').trim().isLength({ min: 2 }).withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('project').isMongoId().withMessage('Valid project id is required'),
  body('assignedTo').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid assignee id'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid due date').bail().custom(isTodayOrFuture).withMessage('Due date cannot be in the past'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status')
];

const updateTaskValidators = [
  body('title').optional().trim().isLength({ min: 2 }).withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('project').optional().isMongoId().withMessage('Valid project id is required'),
  body('assignedTo').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid assignee id'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid due date').bail().custom(isTodayOrFuture).withMessage('Due date cannot be in the past'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status')
];

router.route('/')
  .get(
    protect,
    query('project').optional().isMongoId(),
    query('status').optional().isIn(['todo', 'in-progress', 'completed']),
    validate,
    listTasks
  )
  .post(protect, createTaskValidators, validate, createTask);

router.route('/:id')
  .get(protect, param('id').isMongoId(), validate, getTask)
  .put(protect, param('id').isMongoId(), updateTaskValidators, validate, updateTask)
  .delete(protect, param('id').isMongoId(), validate, deleteTask);

export default router;
