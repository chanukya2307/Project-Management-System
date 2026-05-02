import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const populateProject = (query) => query
  .populate('owner', 'name email role')
  .populate('members', 'name email role');

const scopedProjectFilter = (user) => {
  if (user.role === 'admin') return {};
  return { $or: [{ owner: user._id }, { members: user._id }] };
};

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await populateProject(Project.find(scopedProjectFilter(req.user)))
    .sort({ updatedAt: -1 });

  res.json({ projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, members = [], startDate, dueDate } = req.body;
  const uniqueMembers = [...new Set([...members, req.user._id.toString()])];

  const project = await Project.create({
    name,
    description,
    status,
    members: uniqueMembers,
    startDate,
    dueDate,
    owner: req.user._id
  });

  const populatedProject = await populateProject(Project.findById(project._id));
  res.status(201).json({ project: populatedProject });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findById(req.project._id));
  const tasks = await Task.find({ project: req.project._id })
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role')
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ project, tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { name, description, status, members, startDate, dueDate } = req.body;

  if (req.user.role !== 'admin' && req.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Only project owners and admins can update projects');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(req.project, {
    name: name ?? req.project.name,
    description: description ?? req.project.description,
    status: status ?? req.project.status,
    members: members ?? req.project.members,
    startDate: startDate ?? req.project.startDate,
    dueDate: dueDate ?? req.project.dueDate
  });

  await req.project.save();
  const project = await populateProject(Project.findById(req.project._id));
  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Only project owners and admins can delete projects');
    error.statusCode = 403;
    throw error;
  }

  await Task.deleteMany({ project: req.project._id });
  await req.project.deleteOne();
  res.status(204).send();
});
