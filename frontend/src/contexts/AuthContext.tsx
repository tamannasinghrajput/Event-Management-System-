import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, healthCheck } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  regNumber: string;
  department?: string;
  year?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendAvailable: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    regNumber: string;
    department?: string;
    year?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for fallback when backend is unavailable
const mockUsers = [
  { id: '1', email: 'student@srmist.edu.in', password: 'student123', name: 'Rahul Kumar', role: 'student', regNumber: 'RA2211003010001' },
  { id: '2', email: 'harsh@srmist.edu.in', password: 'harsh123', name: 'Harsh', role: 'student', regNumber: 'RA2211003010002' },
  { id: '3', email: 'admin@srmist.edu.in', password: 'admin123', name: 'Admin', role: 'admin', regNumber: 'ADMIN001' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  useEffect(() => {
    // Check backend availability and restore session
    const initAuth = async () => {
      // Check if backend is running
      const backendUp = await healthCheck();
      setIsBackendAvailable(backendUp);

      // Try to restore session from localStorage
      const savedUser = localStorage.getItem('srm_user');
      const savedToken = localStorage.getItem('srm_token');

      if (savedUser && savedToken) {
        try {
          if (backendUp) {
            // Verify token with backend
            const { user: currentUser } = await authApi.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Use saved user data
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem('srm_user');
          localStorage.removeItem('srm_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (isBackendAvailable) {
        // Use real API
        const { user: loggedInUser, token } = await authApi.login(email, password);
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('srm_user', JSON.stringify(loggedInUser));
        localStorage.setItem('srm_token', token);
        return true;
      } else {
        // Fallback to mock authentication
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('srm_user', JSON.stringify(userWithoutPassword));
          localStorage.setItem('srm_token', 'mock-token');
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    regNumber: string;
    department?: string;
    year?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      if (isBackendAvailable) {
        const { user: newUser, token } = await authApi.register(userData);
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('srm_user', JSON.stringify(newUser));
        localStorage.setItem('srm_token', token);
        return true;
      } else {
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 500));
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          role: 'student',
          regNumber: userData.regNumber,
          department: userData.department,
          year: userData.year,
          phone: userData.phone,
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('srm_user', JSON.stringify(newUser));
        localStorage.setItem('srm_token', 'mock-token');
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('srm_user');
    localStorage.removeItem('srm_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, isBackendAvailable, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
