import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { SignUpRequest, SignUpResponse } from '../types';
import { Button } from '../components/ui/button';
import { AuthLayout } from '../components/AuthLayout';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

import { toast } from 'react-toastify';

const SignupPatient: React.FC = () => {
  const [form, setForm] = useState<SignUpRequest>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await API.post<{ details: SignUpResponse }>(
        '/signup/patient',
        form
      );
      localStorage.setItem('token', res.data.details.token);
      localStorage.setItem('userUUID', res.data.details.user_uuid);
      localStorage.setItem('role', res.data.details.role);
      localStorage.setItem('first_name', res.data.details.first_name);
      localStorage.setItem('last_name', res.data.details.last_name);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Patient Registration"
      description="Create a new patient account to manage your appointments and medical records"
    >
      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="block text-gray-700 mb-2">First Name</Label>
              <Input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-gray-700 mb-2">Last Name</Label>
              <Input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="block text-gray-700 mb-2">Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="text-xs text-teal-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
                value={form.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        <div className="mt-4 space-y-1">
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/" className="text-teal-600 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-center text-sm">
            Not a patient?{' '}
            <Link to="/signup/doctor" className="text-teal-600 hover:underline">
              Sign up as a doctor
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPatient;
