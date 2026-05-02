import api from './api.js';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};
