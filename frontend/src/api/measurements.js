import api from './axios';

export const getMeasurements = () => api.get('/api/v1/measurements');
export const createMeasurements = (data) => api.post('/api/v1/measurements', data);
export const deleteMeasurements = () => api.delete('/api/v1/measurements');
