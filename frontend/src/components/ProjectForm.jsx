import { useEffect, useState } from 'react';
import { todayInputDate } from '../utils/formatters.js';

const initialState = {
  name: '',
  description: '',
  status: 'active',
  members: [],
  startDate: '',
  dueDate: ''
};

const ProjectForm = ({ users = [], initialValue, onSubmit, submitting }) => {
  const [form, setForm] = useState(initialState);
  const minDate = todayInputDate();

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || '',
        description: initialValue.description || '',
        status: initialValue.status || 'active',
        members: initialValue.members?.map((member) => member._id || member.id) || [],
        startDate: initialValue.startDate?.slice(0, 10) || '',
        dueDate: initialValue.dueDate?.slice(0, 10) || ''
      });
    }
  }, [initialValue]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(id)
        ? current.members.filter((memberId) => memberId !== id)
        : [...current.members, id]
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={update} required className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={update} rows="4" className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="startDate">Start</label>
          <input id="startDate" type="date" name="startDate" value={form.startDate} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="dueDate">Due</label>
          <input id="dueDate" type="date" name="dueDate" min={form.startDate || minDate} value={form.dueDate} onChange={update} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
      </div>
      {users.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700">Team</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                <input type="checkbox" checked={form.members.includes(user._id)} onChange={() => toggleMember(user._id)} />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <button disabled={submitting} className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? 'Saving...' : 'Save project'}
      </button>
    </form>
  );
};

export default ProjectForm;
