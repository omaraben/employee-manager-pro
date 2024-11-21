import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "@/lib/api";

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

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for email:', email);
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const userData = await loginUser(email, password);
      setUser(userData);

      console.log("Login successful, redirecting to:", userData.role === 'admin' ? '/admin' : '/employee');
      if (userData.role === 'admin') {
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