export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(', ');
  }

  if (data?.message) return data.message;

  if (error?.code === 'ERR_NETWORK') {
    return 'Cannot reach the API. Check the backend URL and CORS settings.';
  }

  return error?.message || fallback;
};
