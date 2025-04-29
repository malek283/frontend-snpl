import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  is_approved: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: 'client' | 'marchand';
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userRole: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp > currentTime) {
          setToken(storedToken);
          setUser(decoded.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const loginHandler = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await login(email, password);
      const { access_token, user } = data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Connexion réussie !');
      navigate(user.role === 'admin' ? '/admin' : user.role === 'marchand' ? '/merchant' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const registerHandler = async (userData: RegisterData) => {
    try {
      setLoading(true);
      await register(userData);
      toast.success('Inscription réussie ! Veuillez vous connecter.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Échec de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.info('Vous êtes déconnecté');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole: user?.role || null,
        token,
        loading,
        login: loginHandler,
        register: registerHandler,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};