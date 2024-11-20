import { supabase } from "@/integrations/supabase/client";
import { Employee, EntryData } from "@/types/types";

// User Management
export const createUser = async (userData: Omit<Employee, "id">) => {
  console.log('Creating user:', userData);
  
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password!,
    options: {
      data: {
        name: userData.name,
        role: userData.role
      }
    }
  });

  if (authError) throw authError;
  
  return {
    id: authData.user!.id,
    email: userData.email,
    name: userData.name,
    role: userData.role
  };
};

export const getUsers = async () => {
  console.log('Fetching all users');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role');
    
  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
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
    email: data.user.email!,
    name: profile.name,
    role: profile.role
  };
};