import api from './axios';

export const deleteAccount = () => api.delete('/api/v1/users/me');
