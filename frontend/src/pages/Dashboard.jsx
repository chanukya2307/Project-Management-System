import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import { fetchDashboardStats } from '../services/dashboardService.js';
import { formatDate, isOverdue } from '../utils/formatters.js';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Loading dashboard...</div>;

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Project health, workload, and overdue visibility.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={stats.totalProjects || 0} />
        <StatCard label="Active projects" value={stats.activeProjects || 0} tone="mint" />
        <StatCard label="Open tasks" value={(stats.todoTasks || 0) + (stats.inProgressTasks || 0)} tone="ink" />
        <StatCard label="Overdue tasks" value={stats.overdueTasks || 0} tone="coral" />
      </div>
      <section className="rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-ink">Recent tasks</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {data?.recentTasks?.length ? data.recentTasks.map((task) => (
            <div key={task._id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-medium text-ink">{task.title}</p>
                <p className="mt-1 text-sm text-slate-500">{task.project?.name || 'No project'} • {task.assignedTo?.name || 'Unassigned'} • Due {formatDate(task.dueDate)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge value={task.status} />
                <Badge value={task.priority} type="priority" />
                {isOverdue(task) && <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Overdue</span>}
              </div>
            </div>
          )) : <div className="p-5"><EmptyState title="No tasks yet" subtitle="Create tasks to populate your delivery feed." /></div>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
