import { supabase } from "../integrations/supabase/client";
import { Employee, EntryData } from "@/types/types";

// User Management
export const createUser = async (userData: Omit<Employee, "id">) => {
  console.log('Creating user:', userData);
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: userData.id, // Make sure the ID is passed from auth
      name: userData.name,
      role: userData.role
    })
    .select()
    .single();
    
  if (error) throw error;
  return profile;
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, "id" | "created_at">) => {
  console.log('Creating entry:', entry);
  const { data, error } = await supabase
    .from('entries')
    .insert([entry])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  console.log('Fetching all users');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role');
    
  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
    
  if (error) throw error;
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Fetch the user's profile after successful authentication
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) throw profileError;
  
  return {
    id: data.user.id,
    email: data.user.email,
    name: profile.name,
    role: profile.role
  };
};