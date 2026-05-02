import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const projectFilter = req.user.role === 'admin'
    ? {}
    : { $or: [{ owner: req.user._id }, { members: req.user._id }] };
  const taskFilter = req.user.role === 'admin'
    ? {}
    : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };

  const [
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    recentTasks
  ] = await Promise.all([
    Project.countDocuments(projectFilter),
    Project.countDocuments({ ...projectFilter, status: 'active' }),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: 'completed' }),
    Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
    Task.countDocuments({ ...taskFilter, status: 'todo' }),
    Task.countDocuments({ ...taskFilter, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
    Task.find(taskFilter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })
      .limit(8)
  ]);

  res.json({
    stats: {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks
    },
    recentTasks
  });
});
