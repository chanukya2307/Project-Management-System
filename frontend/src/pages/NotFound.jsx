import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
    <div>
      <h1 className="text-4xl font-bold text-ink">404</h1>
      <p className="mt-3 text-slate-500">This page does not exist.</p>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Back to dashboard</Link>
    </div>
  </main>
);

export default NotFound;
