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
          <img
            src="https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-c60c-520a-9f76-153052119131/raw?se=2025-04-02T20%3A03%3A47Z&sp=r&sv=2024-08-04&sr=b&scid=df0feec4-1522-52ea-b578-08645ae93c13&skoid=cdb71e28-0a5b-4faa-8cf5-de6084d65b8f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A07%3A06Z&ske=2025-04-03T16%3A07%3A06Z&sks=b&skv=2024-08-04&sig=IUBHzFAZnEUm1HbyEo1y2ozvk8myV1MHLh9Nks%2BduPs%3D"
            alt="image"
            width={500}
            className="mx-auto"
          />
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
