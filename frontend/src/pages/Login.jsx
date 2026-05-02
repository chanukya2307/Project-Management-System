import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthShell from './AuthShell.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your projects and tasks.">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
        <button disabled={submitting} className="focus-ring w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">New here? <Link className="font-semibold text-brand" to="/signup">Create an account</Link></p>
    </AuthShell>
  );
};

export default Login;
