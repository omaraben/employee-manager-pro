import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userWithProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || session.user.email!,
            role: profile.role || 'employee'
          };
          setUser(userWithProfile);
          localStorage.setItem('user', JSON.stringify(userWithProfile));
        }
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Error loading user profile');
          return;
        }

        if (profile) {
          const userWithProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || session.user.email!,
            role: profile.role || 'employee'
          };
          setUser(userWithProfile);
          localStorage.setItem('user', JSON.stringify(userWithProfile));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for email:', email);
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        throw signInError;
      }

      if (!authUser) {
        throw new Error("No user returned after login");
      }

      // Fetch the user's profile from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      const userWithProfile = {
        id: authUser.id,
        email: authUser.email!,
        name: profile.name || authUser.email!,
        role: profile.role || 'employee'
      };

      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      
      if (userWithProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};