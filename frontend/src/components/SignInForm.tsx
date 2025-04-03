import React, { useState } from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { LoginRequest, LoginResponse } from '../types';
import API from '../api';

import { toast } from 'react-toastify';

const SignInForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await API.post<{ details: LoginResponse }>(
        role === 'patient' ? '/signin/patient' : '/signin/doctor',
        form
      );
      localStorage.setItem('token', res.data.details.token);
      localStorage.setItem('userUUID', res.data.details.user_uuid);
      localStorage.setItem('role', res.data.details.role);
      localStorage.setItem('first_name', res.data.details.first_name);
      localStorage.setItem('last_name', res.data.details.last_name);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <Select defaultValue={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="name@example.com"
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
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
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
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          to={role === 'patient' ? '/signup' : '/signup/doctor'}
          className="text-teal-600 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
