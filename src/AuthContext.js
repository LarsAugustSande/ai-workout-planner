import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple mock login - in production this would call an API
    const mockUser = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const register = (email, password, name) => {
    // Simple mock registration - in production this would call an API
    const mockUser = {
      id: Date.now(),
      email: email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear other user-related data if needed
    localStorage.removeItem('workoutPlans');
    localStorage.removeItem('mealPlans');
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoggedIn,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

