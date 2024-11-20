import { db } from "./mysql";
import { Employee, EntryData } from "@/types/types";

// User Management
export const createUser = async (email: string, password: string, name: string, role: string) => {
  console.log('Creating user:', { email, name, role });
  const [result]: any = await db.execute(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, password, name, role]
  );
  
  return { id: result.insertId, email, name, role };
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, 'id' | 'created_at'>) => {
  console.log('Creating entry:', entry);
  const [result]: any = await db.execute(
    `INSERT INTO entries (user_id, name, serial_numbers, id_number, phone_number, 
      van_shop, allocation_date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [entry.user_id, entry.name, entry.serial_numbers, entry.id_number, 
     entry.phone_number, entry.van_shop, entry.allocation_date, entry.location]
  );
  
  return { id: result.insertId, ...entry };
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const [rows] = await db.execute('SELECT * FROM entries ORDER BY created_at DESC');
  return rows;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const [rows] = await db.execute(
    'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

export const getUsers = async () => {
  console.log('Fetching all users');
  const [rows] = await db.execute('SELECT id, name, role FROM users');
  return rows;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  await db.execute('DELETE FROM users WHERE id = ?', [userId]);
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const [rows]: any = await db.execute(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  const user = rows[0];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};