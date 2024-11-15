import { supabase } from './supabase';
import { Employee, EntryData } from '@/types/types';

// User Management
export const createUser = async (email: string, password: string, name: string, role: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (authError) throw authError;
  return authData;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('entries')
    .insert([{ ...entry, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEntries = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getUserEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// User Management
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};