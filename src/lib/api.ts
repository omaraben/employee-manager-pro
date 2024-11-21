import { Employee, EntryData } from "@/types/types";
import { query } from "./db";

// User Management
export const createUser = async (userData: Omit<Employee, "id">) => {
  console.log('Creating user:', userData);
  
  const result: any = await query(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [userData.email, userData.password, userData.name, userData.role]
  );
  
  return {
    id: result.insertId.toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role
  };
};

export const getUsers = async () => {
  console.log('Fetching all users');
  return await query('SELECT id, name, email, role FROM users');
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  await query('DELETE FROM users WHERE id = ?', [userId]);
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const users: any[] = await query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  
  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }
  
  const user = users[0];
  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
    role: user.role
  };
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, "id" | "created_at">) => {
  console.log('Creating entry:', entry);
  const result: any = await query(
    `INSERT INTO entries (
      user_id, name, serial_numbers, id_number, 
      phone_number, van_shop, allocation_date, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.user_id, entry.name, entry.serial_numbers, entry.id_number,
      entry.phone_number, entry.van_shop, entry.allocation_date, entry.location
    ]
  );
  
  return {
    id: result.insertId.toString(),
    ...entry,
    created_at: new Date().toISOString()
  };
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  return await query('SELECT * FROM entries ORDER BY created_at DESC');
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  return await query(
    'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
};