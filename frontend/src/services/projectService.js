import api from './api.js';

export const fetchProjects = async () => {
  const { data } = await api.get('/projects');
  return data.projects;
};

export const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post('/projects', payload);
  return data.project;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data.project;
};

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};
