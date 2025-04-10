
import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  type: 'candidate' | 'employer';
}

interface User {
  email: string;
  password: string;
  name?: string;
}

// Mock database for demonstration - in a real app this would be handled by a proper backend
const mockUsers: User[] = [
  { email: "test@example.com", password: "password123", name: "Test User" }
];

export const checkUserExists = (email: string): boolean => {
  return mockUsers.some(user => user.email === email);
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(user => user.email === email && user.password === password);
  return user || null;
};

export const registerUser = (email: string, password: string, name?: string): User => {
  const newUser = { email, password, name };
  mockUsers.push(newUser);
  return newUser;
};

const AuthLayout = ({ children, title, subtitle, type }: AuthLayoutProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${theme}`}>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to home
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-black/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
            {subtitle && <p className="text-white/70">{subtitle}</p>}
            <div className="mt-4 text-sm">
              {type === 'candidate' ? (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">For Job Seekers</span>
              ) : (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">For Employers</span>
              )}
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
