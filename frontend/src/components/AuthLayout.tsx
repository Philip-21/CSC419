import type React from 'react';
import { Activity } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-muted p-8 md:h-screen md:w-1/2 lg:p-12">
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </div>
        <div className="hidden h-screen w-1/2 flex-col bg-[#0e9a8e] p-10 text-white md:flex">
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "MediCare HIS has revolutionized how we manage patient care. The
                streamlined interface and powerful tools have improved our
                efficiency and patient outcomes."
              </p>
              <footer className="text-sm">
                Dr. Emily Chen, Chief of Medicine
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
