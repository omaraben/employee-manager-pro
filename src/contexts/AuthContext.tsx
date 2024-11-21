import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: Session) => {
    try {
      console.log("Handling session for user:", session.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (profile) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: profile.name || '',
          role: profile.role || 'employee'
        };
        console.log("Setting user data:", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Session handling error:", error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for email:', email);
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw new Error("Error fetching user profile");
      }

      if (profile) {
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: profile.name || '',
          role: profile.role || 'employee'
        };
        setUser(userData);

        console.log("Login successful, redirecting to:", profile.role === 'admin' ? '/admin' : '/employee');
        if (profile.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
        
        toast.success("Logged in successfully");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
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