import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authApi } from "../services/apiClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, callback?: () => void) => Promise<void>;
  signup: (email: string, password: string, name: string, callback?: () => void) => Promise<void>;
  logout: (callback?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for stored authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, callback?: () => void) => {
    try {
      setIsLoading(true);
      const data = await authApi.login(email, password);
      
      // Store in local storage
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      toast.success("Logged in successfully");
      navigate('/');
      if (callback) callback();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, callback?: () => void) => {
    try {
      setIsLoading(true);
      await authApi.signup(email, password, name);
      toast.success("Account created successfully! You can now log in.");
      navigate('/login');
      if (callback) callback();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (callback?: () => void) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/login');
    if (callback) callback();
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};