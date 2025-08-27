'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the shape of the verification data from KV
type AuthTokenData = {
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  phoneNumber: string;
  createdAt: number;
  expiresAt: number;
};

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('This verification link is invalid or expired.');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token found in the link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Verification failed.');
        }

        // On successful verification, the API returns the phone number
        const phoneNumber = result.phoneNumber;
        if (!phoneNumber) {
             throw new Error('Verification data is incomplete.');
        }
        
        // Store user info and redirect
        localStorage.setItem('userPhoneNumber', phoneNumber);
        localStorage.setItem('verificationToken', token); // Still useful for session validation
        
        setStatus('success');
        
        setTimeout(() => {
          router.push('/dashboard?verified=true');
        }, 2000);

      } catch (error) {
        setStatus('error');
        if (error instanceof Error) {
            setErrorMessage(error.message);
        }
        console.error('Verification error:', error);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-xl font-semibold">Verifying...</h1>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-xl font-semibold">Verification Failed</h1>
            <p className="text-muted-foreground">{errorMessage}</p>
            <Button onClick={() => router.push('/login')}>Back to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h1 className="text-xl font-semibold">Verification Successful!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
}
