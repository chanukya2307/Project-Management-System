import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const populateTask = (query) => query
  .populate('project', 'name status')
  .populate('assignedTo', 'name email role')
  .populate('createdBy', 'name email role');

const scopedTaskFilter = (user) => {
  if (user.role === 'admin') return {};
  return {
    $or: [
      { assignedTo: user._id },
      { createdBy: user._id }
    ]
  };
};

const ensureProjectMember = async (projectId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'admin') return project;

  const userId = user._id.toString();
  const allowed = project.owner.toString() === userId
    || project.members.some((memberId) => memberId.toString() === userId);

  if (!allowed) {
    const error = new Error('Project access denied');
    error.statusCode = 403;
    throw error;
  }

  return project;
};

const ensureTaskAccess = (task, user) => {
  if (user.role === 'admin') return;

  const userId = user._id.toString();
  const canAccess = task.createdBy.toString() === userId
    || task.assignedTo?._id?.toString() === userId
    || task.assignedTo?.toString() === userId;

  if (!canAccess) {
    const error = new Error('Task access denied');
    error.statusCode = 403;
    throw error;
  }
};

export const listTasks = asyncHandler(async (req, res) => {
  const filter = { ...scopedTaskFilter(req.user) };

  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;

  const tasks = await populateTask(Task.find(filter)).sort({ dueDate: 1, updatedAt: -1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, dueDate, priority, status } = req.body;
  await ensureProjectMember(project, req.user);

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo: assignedTo || undefined,
    dueDate,
    priority,
    status,
    createdBy: req.user._id
  });

  const populatedTask = await populateTask(Task.findById(task._id));
  res.status(201).json({ task: populatedTask });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await populateTask(Task.findById(req.params.id));

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  ensureTaskAccess(task, req.user);
  res.json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  ensureTaskAccess(task, req.user);

  const { title, description, project, assignedTo, dueDate, priority, status } = req.body;
  if (project) await ensureProjectMember(project, req.user);

  Object.assign(task, {
    title: title ?? task.title,
    description: description ?? task.description,
    project: project ?? task.project,
    assignedTo: assignedTo ?? task.assignedTo,
    dueDate: dueDate ?? task.dueDate,
    priority: priority ?? task.priority,
    status: status ?? task.status
  });

  await task.save();
  const populatedTask = await populateTask(Task.findById(task._id));
  res.json({ task: populatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  ensureTaskAccess(task, req.user);
  await task.deleteOne();
  res.status(204).send();
});
