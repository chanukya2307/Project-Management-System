import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteProject, fetchProject } from '../services/projectService.js';
import { createTask, updateTask } from '../services/taskService.js';
import { fetchUsers } from '../services/userService.js';
import { formatDate, isOverdue } from '../utils/formatters.js';

const statuses = ['todo', 'in-progress', 'completed'];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [projectData, userData] = await Promise.all([
      fetchProject(id),
      user.role === 'admin' ? fetchUsers() : Promise.resolve([])
    ]);
    setProject(projectData.project);
    setTasks(projectData.tasks);
    setUsers(user.role === 'admin' ? userData : projectData.project.members || []);
  };

  useEffect(() => {
    load();
  }, [id]);

  const saveTask = async (payload) => {
    setSubmitting(true);
    try {
      await createTask({ ...payload, project: id });
      setOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (task, status) => {
    await updateTask(task._id, { status });
    await load();
  };

  const removeProject = async () => {
    await deleteProject(id);
    navigate('/projects');
  };

  if (!project) return <div className="text-sm text-slate-500">Loading project...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">{project.name}</h1>
            <Badge value={project.status} />
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">{project.description || 'No description'}</p>
          <p className="mt-3 text-sm text-slate-600">Due {formatDate(project.dueDate)} • {project.members?.length || 0} members</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(true)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={16} />
            Task
          </button>
          {(user.role === 'admin' || project.owner?._id === user.id) && (
            <button onClick={removeProject} className="focus-ring inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => (
          <section key={status} className="min-h-80 rounded-lg border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-200 px-4 py-3">
              <Badge value={status} />
            </div>
            <div className="space-y-3 p-4">
              {tasks.filter((task) => task.status === status).map((task) => (
                <article key={task._id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-ink">{task.title}</h3>
                    <Badge value={task.priority} type="priority" />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{task.description || 'No description'}</p>
                  <p className="mt-3 text-sm text-slate-600">Assigned to {task.assignedTo?.name || 'Unassigned'}</p>
                  <p className={`mt-1 text-sm ${isOverdue(task) ? 'font-semibold text-red-700' : 'text-slate-500'}`}>Due {formatDate(task.dueDate)}</p>
                  <select value={task.status} onChange={(event) => changeStatus(task, event.target.value)} className="focus-ring mt-3 w-full rounded-md border border-slate-300 px-2 py-2 text-sm">
                    {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </article>
              ))}
              {!tasks.filter((task) => task.status === status).length && <EmptyState title="No tasks" subtitle="This lane is clear." />}
            </div>
          </section>
        ))}
      </div>
      <Modal title="New task" open={open} onClose={() => setOpen(false)}>
        <TaskForm projects={[project]} users={users} initialProject={id} onSubmit={saveTask} submitting={submitting} />
      </Modal>
    </div>
  );
};

export default ProjectDetail;
