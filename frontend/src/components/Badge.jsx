import { titleCase } from '../utils/formatters.js';

const Badge = ({ value, type = 'status' }) => {
  const maps = {
    status: {
      todo: 'bg-slate-100 text-slate-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-emerald-100 text-emerald-700',
      planning: 'bg-amber-100 text-amber-700',
      active: 'bg-blue-100 text-blue-700',
      archived: 'bg-slate-100 text-slate-600'
    },
    priority: {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    }
  };

  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${maps[type]?.[value] || 'bg-slate-100 text-slate-700'}`}>
      {titleCase(value)}
    </span>
  );
};

export default Badge;
