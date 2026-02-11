import { handleApiResponse } from './error-handler.js';

export const apiClient = {
  async get(url) {
    const response = await fetch(url);
    return handleApiResponse(response);
  }
};
