import api from './api.js';

export const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data.users;
};
