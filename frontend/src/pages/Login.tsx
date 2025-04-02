import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import SignInForm from '../components/SignInForm';

const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access the system"
    >
      <SignInForm />
    </AuthLayout>
  );
};

export default Login;
