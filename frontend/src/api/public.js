import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://measurely-backend-production.up.railway.app',
});

export const getPublicMeasurements = (code) =>
  publicApi.get(`/api/v1/public/measurements/${code}`);
