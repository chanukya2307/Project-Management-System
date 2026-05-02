import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

export const loadProject = asyncHandler(async (req, _res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.project;
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  req.project = project;
  next();
});

export const requireProjectAccess = (req, _res, next) => {
  if (req.user.role === 'admin') return next();

  const userId = req.user._id.toString();
  const isOwner = req.project.owner.toString() === userId;
  const isMember = req.project.members.some((memberId) => memberId.toString() === userId);

  if (!isOwner && !isMember) {
    const error = new Error('Project access denied');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};
