"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  username: string;
  password: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoaded: boolean;
  login: (username: string, password: string) => { success: boolean; message: string; user?: User };
  signup: (username: string, password: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
}

const STORAGE_KEY = "cart_rescue_users";
const CURRENT_USER_KEY = "cart_rescue_current_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function seedDefaultUsers(): User[] {
  return [
    {
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      username: "Samantha",
      password: "vip123",
      role: "customer",
      createdAt: new Date().toISOString()
    },
    {
      username: "David",
      password: "david123",
      role: "customer",
      createdAt: new Date().toISOString()
    }
  ];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load users and active session from localStorage on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const seeded = seedDefaultUsers();
        setUsers(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }

      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load auth state:", err);
      const seeded = seedDefaultUsers();
      setUsers(seeded);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist users whenever they change
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (err) {
        console.error("Failed to save users:", err);
      }
    }
  }, [users]);

  function login(username: string, password: string) {
    const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, message: "User not found. Please sign up first." };
    }
    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }
    setCurrentUser(user);
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error("Failed to save current user session:", err);
    }
    return { success: true, message: `Welcome back, ${user.username}!`, user };
  }

  function signup(username: string, password: string) {
    const trimmed = username.trim();
    if (!trimmed || !password) {
      return { success: false, message: "Username and password are required." };
    }
    if (users.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: "Username already exists. Please log in instead." };
    }
    const newUser: User = {
      username: trimmed,
      password,
      role: "customer",
      createdAt: new Date().toISOString()
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    } catch (err) {
      console.error("Failed to save current user session:", err);
    }
    return { success: true, message: `Account created for ${trimmed}!`, user: newUser };
  }

  function logout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (err) {
      console.error("Failed to clear current user session:", err);
    }
  }

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoaded,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
