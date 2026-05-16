import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../utils/apiError.js';
import AuthShell from './AuthShell.jsx';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    jobTitle: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      await signup(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create account'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start with a workspace role and invite your team later.">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="name" placeholder="Full name" value={form.name} onChange={update} required autoComplete="name" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
          <input name="email" type="email" placeholder="Work email" value={form.email} onChange={update} required autoComplete="email" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="jobTitle" placeholder="Job title" value={form.jobTitle} onChange={update} autoComplete="organization-title" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
          <input name="department" placeholder="Department" value={form.department} onChange={update} autoComplete="organization" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={update} autoComplete="tel" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required minLength="8" autoComplete="new-password" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
          <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={update} required minLength="8" autoComplete="new-password" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <button disabled={submitting} className="focus-ring w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Already have an account? <Link className="font-semibold text-brand" to="/login">Log in</Link></p>
    </AuthShell>
  );
};

export default Signup;
