import { Employee, EntryData } from "@/types/types";
import axios from 'axios';
import { toast } from "sonner";

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    const message = error.response?.data?.message || 
      (error.code === 'ECONNABORTED' ? 'Server is not responding' : 'Network error occurred');
    toast.error(message);
    return Promise.reject(error);
  }
);

// User Management
export const createUser = async (userData: Omit<Employee, "id">) => {
  console.log('Creating user:', userData);
  const response = await api.post('/users', userData);
  return response.data;
};

export const getUsers = async () => {
  console.log('Fetching all users');
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  await api.delete(`/users/${userId}`);
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, "id" | "created_at">) => {
  console.log('Creating entry:', entry);
  const response = await api.post('/entries', entry);
  return response.data;
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const response = await api.get('/entries');
  return response.data;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const response = await api.get(`/entries/user/${userId}`);
  return response.data;
};