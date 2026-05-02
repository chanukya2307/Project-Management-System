import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createProject, fetchProjects } from '../services/projectService.js';
import { fetchUsers } from '../services/userService.js';
import { formatDate } from '../utils/formatters.js';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [projectData, userData] = await Promise.all([
      fetchProjects(),
      user.role === 'admin' ? fetchUsers() : Promise.resolve([])
    ]);
    setProjects(projectData);
    setUsers(userData);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (payload) => {
    setSubmitting(true);
    try {
      await createProject(payload);
      setOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Create projects, assign team members, and track progress.</p>
        </div>
        <button onClick={() => setOpen(true)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} />
          New project
        </button>
      </div>
      {projects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink">{project.name}</h2>
                <Badge value={project.status} />
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-500">{project.description || 'No description'}</p>
              <div className="mt-5 text-sm text-slate-600">
                <p>Owner: {project.owner?.name}</p>
                <p>Due: {formatDate(project.dueDate)}</p>
                <p>Team: {project.members?.length || 0}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No projects found" subtitle="Start by creating a project for your team." />
      )}
      <Modal title="New project" open={open} onClose={() => setOpen(false)}>
        <ProjectForm users={users} onSubmit={save} submitting={submitting} />
      </Modal>
    </div>
  );
};

export default Projects;
