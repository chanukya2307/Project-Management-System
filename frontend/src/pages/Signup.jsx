import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthShell from './AuthShell.jsx';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start with a workspace role and invite your team later.">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <input name="name" placeholder="Name" value={form.name} onChange={update} required className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required minLength="8" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <select name="role" value={form.role} onChange={update} className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={submitting} className="focus-ring w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Already have an account? <Link className="font-semibold text-brand" to="/login">Log in</Link></p>
    </AuthShell>
  );
};

export default Signup;
