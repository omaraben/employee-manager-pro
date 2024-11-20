import axios from 'axios';
import { Employee, EntryData } from "@/types/types";

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  // Users
  createUser: async (userData: Omit<Employee, "id">) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await axios.delete(`${API_URL}/users/${id}`);
  },

  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Entries
  createEntry: async (entry: Omit<EntryData, "id" | "created_at">) => {
    const response = await axios.post(`${API_URL}/entries`, entry);
    return response.data;
  },

  getEntries: async () => {
    const response = await axios.get(`${API_URL}/entries`);
    return response.data;
  },

  getUserEntries: async (userId: string) => {
    const response = await axios.get(`${API_URL}/entries/user/${userId}`);
    return response.data;
  }
};