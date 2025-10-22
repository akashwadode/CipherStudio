import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

export const saveProject = async (projectId, projectName, files) => {
  try {
    const response = await axios.post(API_URL, { projectId, projectName, files });
    return response.data;
  } catch (error) {
    console.error('❌ Save Error:', error);
    throw error;
  }
};

export const loadProject = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data ? response.data : null;
  } catch (error) {
    console.error('❌ Load Error:', error);
    return null;
  }
};

export const generateId = () => {
  return 'project_' + Date.now();
};