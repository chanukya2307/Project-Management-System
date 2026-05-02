import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchUsers } from '../services/userService.js';
import { formatDate } from '../utils/formatters.js';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Admin-only team directory.</p>
      </div>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4 font-medium text-ink">{item.name}</td>
                    <td className="px-5 py-4 text-slate-600">{item.email}</td>
                    <td className="px-5 py-4"><Badge value={item.role} /></td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="p-5"><EmptyState title="No users" subtitle="Users appear here after signup." /></div>}
      </section>
    </div>
  );
};

export default Users;
