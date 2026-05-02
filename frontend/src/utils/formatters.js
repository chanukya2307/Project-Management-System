export const formatDate = (value) => {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date();
};

export const todayInputDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
};

export const titleCase = (value = '') => value
  .split('-')
  .join(' ')
  .replace(/\b\w/g, (char) => char.toUpperCase());
