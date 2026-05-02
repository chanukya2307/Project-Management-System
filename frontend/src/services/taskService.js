import api from './api.js';

export const fetchTasks = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data.tasks;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data.task;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
