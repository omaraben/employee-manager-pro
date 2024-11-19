import { supabase } from "@/integrations/supabase/client";
import { Employee, EntryData } from "@/types/types";

// User Management
export const createUser = async (email: string, password: string, name: string, role: string) => {
  console.log('Creating user:', { email, name, role });
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  
  if (authError) {
    console.error('Auth error:', authError);
    throw authError;
  }

  console.log('Auth data:', authData);
  return { id: authData.user?.id, email, name, role };
};

// Entry Management
export const createEntry = async (entry: Omit<EntryData, 'id' | 'created_at'>) => {
  console.log('Creating entry:', entry);
  const { data, error } = await supabase
    .from('entries')
    .insert([{
      user_id: entry.user_id,
      name: entry.name,
      serial_numbers: entry.serial_numbers,
      id_number: entry.id_number,
      phone_number: entry.phone_number,
      van_shop: entry.van_shop,
      allocation_date: entry.allocation_date,
      location: entry.location
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Entry creation error:', error);
    throw error;
  }
  return data;
};

export const getEntries = async () => {
  console.log('Fetching all entries');
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Get entries error:', error);
    throw error;
  }
  return data;
};

export const getUserEntries = async (userId: string) => {
  console.log('Fetching entries for user:', userId);
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Get user entries error:', error);
    throw error;
  }
  return data;
};

// User Management
export const getUsers = async () => {
  console.log('Fetching all users');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role');
    
  if (error) {
    console.error('Get users error:', error);
    throw error;
  }
  return data;
};

export const deleteUser = async (userId: string) => {
  console.log('Deleting user:', userId);
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Login error:', error);
    throw error;
  }
  
  if (!user) {
    console.error('No user returned after login');
    return null;
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single();
    
  if (profileError) {
    console.error('Profile fetch error:', profileError);
    throw profileError;
  }
    
  return {
    id: user.id,
    email: user.email,
    name: profile?.name,
    role: profile?.role
  };
};