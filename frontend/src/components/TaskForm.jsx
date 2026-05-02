import { useState } from 'react';
import { todayInputDate } from '../utils/formatters.js';

const TaskForm = ({ projects = [], users = [], onSubmit, submitting, initialProject }) => {
  const minDate = todayInputDate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: initialProject || '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  });

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={update} required className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={update} rows="3" className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="project">Project</label>
          <select id="project" name="project" value={form.project} onChange={update} required className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="">Select project</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="assignedTo">Assignee</label>
          <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="">Unassigned</option>
            {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="dueDate">Due date</label>
          <input id="dueDate" type="date" name="dueDate" min={minDate} value={form.dueDate} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <button disabled={submitting} className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? 'Saving...' : 'Save task'}
      </button>
    </form>
  );
};

export default TaskForm;
