import api, { API_BASE_URL } from './api.js';

const assertAuthResponse = (data) => {
  if (data?.token && data?.user) return data;

  const error = new Error(`Invalid authentication response from API at ${API_BASE_URL}. Check that VITE_API_URL points to the backend and ends with /api.`);
  error.response = {
    data: {
      message: error.message
    }
  };
  throw error;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return assertAuthResponse(data);
};

export const signupRequest = async (payload) => {
  const { data } = await api.post('/auth/signup', payload);
  return assertAuthResponse(data);
};

export const meRequest = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
