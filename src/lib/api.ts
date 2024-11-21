import { Employee, EntryData } from "@/types/types";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// User Management
export const createUser = async (userData: Omit<Employee, "id">) => {
  console.log('Creating user:', userData);
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const getUsers = async () => {
  console.log('Fetching all users');
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  await axios.delete(`${API_URL}/users/${userId}`);
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, "id" | "created_at">) => {
  console.log('Creating entry:', entry);
  const response = await axios.post(`${API_URL}/entries`, entry);
  return response.data;
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const response = await axios.get(`${API_URL}/entries`);
  return response.data;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const response = await axios.get(`${API_URL}/entries/user/${userId}`);
  return response.data;
};