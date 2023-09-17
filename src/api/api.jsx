import axios from "axios";

////////////////////////// DRIVE API ////////////////////////////////
/////////////////////////////////////////////////////////////////////
const base_url = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_BASE_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const getDirectories = async () => {
  return await axios.get(`${base_url}/directory`);
};

export const getSingleDirectory = async (directoryId) => {
  return await axios.get(`${base_url}/directory/${directoryId}`);
};

export const createDirectory = async (data) => {
  return await axios.post(`${base_url}/directory`, data);
};

export const updateDirectory = async (directoryId, data) => {
  return await axios.patch(`${base_url}/directory/${directoryId}/`, data);
};

export const deleteDirectory = async (directoryId) => {
  return await axios.delete(`${base_url}/directory/${directoryId}/`);
};

export const moveDirectory = async (directoryId, data) => {
  return await axios.post(`${base_url}/directory/${directoryId}/`, data);
};

export const getAllFiles = async () => {
  return await axios.get(`${base_url}/files`);
};

export const createFile = async (data) => {
  return await axios.post(`${base_url}/files`, data);
};

export const updateFile = async (fileId, data) => {
  return await axios.patch(`${base_url}/files/${fileId}`, data);
};

export const deleteFile = async (fileId) => {
  return await axios.delete(`${base_url}/files/${fileId}`);
};

export const moveFile = async (fileId, data) => {
  return await axios.post(`${base_url}/files${fileId}`, data);
};
