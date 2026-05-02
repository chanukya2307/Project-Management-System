import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProjects } from '../services/projectService.js';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService.js';
import { fetchUsers } from '../services/userService.js';
import { formatDate, isOverdue } from '../utils/formatters.js';

const Tasks = () => {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [taskData, projectData, userData] = await Promise.all([
      fetchTasks(status ? { status } : {}),
      fetchProjects(),
      user.role === 'admin' ? fetchUsers() : Promise.resolve([])
    ]);
    setTasks(taskData);
    setProjects(projectData);
    setUsers(user.role === 'admin' ? userData : []);
  };

  useEffect(() => {
    load();
  }, [status]);

  const saveTask = async (payload) => {
    setSubmitting(true);
    try {
      await createTask(payload);
      setOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (task, nextStatus) => {
    await updateTask(task._id, { status: nextStatus });
    await load();
  };

  const remove = async (task) => {
    await deleteTask(task._id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">{isAdmin ? 'Track ownership, status, due dates, and priorities.' : 'View and update tasks assigned to you.'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setOpen(true)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={16} />
            New task
          </button>
        )}
      </div>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="focus-ring w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
        <option value="">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <section className="rounded-lg border border-slate-200 bg-white shadow-soft">
        {tasks.length ? tasks.map((task) => (
          <div key={task._id} className="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-ink">{task.title}</h2>
                <Badge value={task.priority} type="priority" />
                {isOverdue(task) && <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Overdue</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500">{task.project?.name || 'No project'} • {task.assignedTo?.name || 'Unassigned'} • Due {formatDate(task.dueDate)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={task.status} onChange={(event) => changeStatus(task, event.target.value)} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {isAdmin && (
                <button onClick={() => remove(task)} className="focus-ring rounded-md border border-red-200 p-2 text-red-700 hover:bg-red-50" aria-label="Delete task">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        )) : <div className="p-5"><EmptyState title="No tasks found" subtitle="Create or adjust filters to see tasks here." /></div>}
      </section>
      {isAdmin && (
        <Modal title="New task" open={open} onClose={() => setOpen(false)}>
          <TaskForm projects={projects} users={users} onSubmit={saveTask} submitting={submitting} />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
