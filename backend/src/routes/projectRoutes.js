import express from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loadProject, requireProjectAccess } from '../middleware/projectAccess.js';
import validate from '../middleware/validate.js';
import { isSameOrAfterField, isTodayOrFuture } from '../utils/dateValidators.js';

const router = express.Router();

const createProjectValidators = [
  body('name').trim().isLength({ min: 2 }).withMessage('Project name is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('status').optional().isIn(['planning', 'active', 'completed', 'archived']).withMessage('Invalid status'),
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*').optional().isMongoId().withMessage('Invalid member id'),
  body('startDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid start date'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid due date').bail().custom(isTodayOrFuture).withMessage('Due date cannot be in the past').bail().custom(isSameOrAfterField('startDate')).withMessage('Due date cannot be before start date')
];

const updateProjectValidators = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Project name is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('status').optional().isIn(['planning', 'active', 'completed', 'archived']).withMessage('Invalid status'),
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*').optional().isMongoId().withMessage('Invalid member id'),
  body('startDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid start date'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid due date').bail().custom(isTodayOrFuture).withMessage('Due date cannot be in the past').bail().custom(isSameOrAfterField('startDate')).withMessage('Due date cannot be before start date')
];

router.route('/')
  .get(protect, listProjects)
  .post(protect, createProjectValidators, validate, createProject);

router.route('/:id')
  .get(protect, param('id').isMongoId(), validate, loadProject, requireProjectAccess, getProject)
  .put(protect, param('id').isMongoId(), updateProjectValidators, validate, loadProject, requireProjectAccess, updateProject)
  .delete(protect, param('id').isMongoId(), validate, loadProject, requireProjectAccess, deleteProject);

export default router;
