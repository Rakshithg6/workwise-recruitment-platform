
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from '@/components/Icons';
import { signInWithGoogle } from '@/lib/firebase';

interface CandidateAuthProps {
  isSignup?: boolean;
}

const CandidateAuth = ({ isSignup = false }: CandidateAuthProps) => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Clear fields when switching between login/signup
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }, [isSignup]);

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
      if (!formData.firstName || !formData.lastName) {
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result.success && result.user) {
      // Store user data in context and localStorage
      updateUserData({
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        photoUrl: result.user.photoURL,
        role: 'candidate'
      });

      // Clear any previous chatbot session data
      localStorage.removeItem('workwise-chatbot-dismissed');
      sessionStorage.removeItem('workwise-chatbot-greeted');

      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google."
      });

      navigate('/candidate/dashboard');
    } else {
      toast({
        title: "Sign in failed",
        description: result.error || "Failed to sign in with Google",
        variant: "destructive"
      });
    }
  };

  const [formMessage, setFormMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const endpoint = isSignup ? '/candidate/signup' : '/candidate/login';
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8000";
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
          description: 'Your candidate account has been created.',
        });
        navigate('/candidate/dashboard'); // Go directly to dashboard after signup
      } else {
        // Store JWT token and user info
        localStorage.setItem('token', data.token);
        updateUserData({
          email: data.user.email,
          id: data.user.id,
          role: 'candidate'
        });
        localStorage.removeItem('workwise-chatbot-dismissed');
        sessionStorage.removeItem('workwise-chatbot-greeted');
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/candidate/dashboard');
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
            {isSignup ? 'Candidate Sign Up' : 'Candidate Login'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isSignup 
              ? 'Create an account to get started' 
              : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button 
              variant="outline" 
              type="button"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-transparent hover:bg-gray-800 border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const result = await signInWithGoogle();
                  if (result.success) {
                    updateUserData({
                      ...result.user,
                      role: 'candidate'
                    });
                    toast({
                      title: 'Success!',
                      description: `Successfully ${isSignup ? 'signed up' : 'logged in'} with Google`,
                    });
                    navigate('/candidate/dashboard');
                  } else {
                    toast({
                      title: 'Authentication Error',
                      description: result.error,
                      variant: 'destructive',
                    });
                    if (result.code === 'auth/unauthorized-domain') {
                      console.log('Please add these domains to Firebase Console:', 
                        '\n- localhost', 
                        '\n- 127.0.0.1',
                        '\n- localhost:8081');
                    }
                  }
                } catch (error: any) {
                  toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Google'}
            </Button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-gray-900">Or continue with email</span>
            </div>
          </div>
          {formMessage && (
            <div className="mb-4 rounded bg-red-900/70 text-red-200 px-3 py-2 text-center text-sm">
              {formMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" autoCorrect="off" spellCheck={false}>

            {isSignup && (
              <>
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="new-email" // random string to defeat autofill
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password-unique" // random string to defeat autofill
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {isSignup && (
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password-unique2" // random string to defeat autofill
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
            <div>
              <Button disabled={isLoading} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Icons.spinner className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  isSignup ? 'Sign Up' : 'Login'
                )}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-400">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/auth/candidate/login" className="text-indigo-400 hover:text-indigo-300">
                  Login
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/auth/candidate/signup" className="text-indigo-400 hover:text-indigo-300">
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

export default CandidateAuth;
