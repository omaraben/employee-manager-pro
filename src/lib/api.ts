import { Employee, EntryData } from '@/types/types';
import pool from './db';
import { ResultSetHeader } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

// User Management
export const createUser = async (email: string, password: string, name: string, role: string) => {
  console.log('Creating user:', { email, name, role });
  const id = uuidv4();
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
    [id, email, password, name, role]
  );
  console.log('User created:', result);
  return { id, email, name, role };
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, 'id' | 'createdAt'>) => {
  console.log('Creating entry:', entry);
  const id = uuidv4();
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO entries (id, user_id, name, serial_numbers, id_number, phone_number, van_shop, allocation_date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, entry.user_id, entry.name, entry.serialNumbers, entry.idNumber, entry.phoneNumber, entry.vanShop, entry.allocationDate, entry.location]
  );
  console.log('Entry created:', result);
  return {
    ...entry,
    id,
    createdAt: new Date().toISOString()
  };
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const [rows] = await pool.execute('SELECT * FROM entries ORDER BY created_at DESC');
  console.log('Entries fetched:', rows);
  return rows;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const [rows] = await pool.execute(
    'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  console.log('User entries fetched:', rows);
  return rows;
};

// User Management
export const getUsers = async () => {
  console.log('Fetching all users');
  const [rows] = await pool.execute('SELECT id, email, name, role FROM users');
  console.log('Users fetched:', rows);
  return rows;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
  console.log('User deleted');
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const [rows]: any = await pool.execute(
    'SELECT id, email, name, role FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  console.log('Login result:', rows);
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
};