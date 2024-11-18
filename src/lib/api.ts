import { Employee, EntryData } from '@/types/types';

// User Management
export const createUser = async (email: string, password: string, name: string, role: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role,
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, 'id' | 'createdAt'>) => {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  localStorage.setItem('entries', JSON.stringify(entries));
  return newEntry;
};

export const getEntries = async () => {
  return JSON.parse(localStorage.getItem('entries') || '[]');
};

export const getUserEntries = async (userId: string) => {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  return entries.filter((entry: EntryData) => entry.user_id === userId);
};

// User Management
export const getUsers = async () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const deleteUser = async (userId: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const filteredUsers = users.filter((user: Employee) => user.id !== userId);
  localStorage.setItem('users', JSON.stringify(filteredUsers));
};