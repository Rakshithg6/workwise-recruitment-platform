
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/Icons";
import { useUser } from '@/contexts/UserContext';

interface EmployerAuthProps {
  isSignup?: boolean;
}

const EmployerAuth = ({ isSignup = false }: EmployerAuthProps) => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });

  // Clear fields when switching between login/signup
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      password: '',
      confirmPassword: ''
    });
  }, [isSignup]);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return false;
      }
      if (!formData.firstName || !formData.lastName || !formData.companyName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return false;
      }
    }
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const [formMessage, setFormMessage] = useState<string | null>(null);

  // List of personal domains not allowed for employer signup
  const personalEmailDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com', 'icloud.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'rediffmail.com', 'msn.com', 'live.com', 'pm.me', 'fastmail.com'
  ];

  const isPersonalEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return personalEmailDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSignup && isPersonalEmail(formData.email)) {
      setFormMessage('Please use your company email address (not gmail, yahoo, outlook, etc).');
      return;
    }
    setIsLoading(true);
    try {
      const endpoint = isSignup ? '/employer/signup' : '/employer/login';
      const apiBase = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8000";
      console.log("[EmployerAuth] API BASE:", apiBase);
      const resp = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await resp.json();
      setIsLoading(false);
      if (!resp.ok) {
        if (!isSignup && data.detail === "User doesn't exist. Please sign up first.") {
          setFormMessage("User doesn't exist. Please sign up.");
        } else {
          setFormMessage(data.detail || 'Authentication failed');
        }
        return;
      }
      setFormMessage(null);
      // On signup, backend returns { message, id }, on login returns { token, user }
      if (isSignup) {
        toast({
          title: 'Signup successful!',
          description: 'Your employer account has been created.',
        });
        navigate('/employer/dashboard'); // Go directly to dashboard after signup
      } else {
        // Store JWT token and user info
        localStorage.setItem('token', data.token);
        updateUserData({
          email: data.user.email,
          id: data.user.id,
          role: 'employer'
        });
        localStorage.removeItem('workwise-chatbot-dismissed');
        sessionStorage.removeItem('workwise-chatbot-greeted');
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/employer/dashboard');
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Network error',
        description: 'Could not connect to backend.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md p-4 sm:p-8 bg-gray-900 shadow-md rounded-lg border border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            {isSignup ? "Employer Sign Up" : "Employer Login"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isSignup ? "Create a new account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {formMessage && (
            <div className="mb-4 rounded bg-red-900/70 text-red-200 px-3 py-2 text-center text-sm">
              {formMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off" autoCorrect="off" spellCheck={false}>
            {isSignup && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Company name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="new-employer-email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                autoComplete="new-password-employer"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {isSignup && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  autoComplete="new-password-employer2"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
            <Button disabled={isLoading} className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>
          <div className="text-sm text-gray-400 text-center mt-4">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/auth/employer/login"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link
                  to="/auth/employer/signup"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerAuth;
