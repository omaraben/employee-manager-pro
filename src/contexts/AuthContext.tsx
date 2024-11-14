import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This is a mock login - replace with actual API call
      const mockUsers = [
        { id: "1", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" },
        { id: "2", email: "employee@example.com", password: "emp123", name: "John Employee", role: "employee" },
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userWithoutPassword.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email or password",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
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