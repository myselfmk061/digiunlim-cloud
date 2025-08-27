'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const phone = searchParams.get('phone');

    if (!token || !phone) {
      setStatus('error');
      return;
    }

    localStorage.setItem('userPhoneNumber', decodeURIComponent(phone));
    localStorage.setItem('verificationToken', token);
    
    setStatus('success');
    
    setTimeout(() => {
      router.push('/dashboard?verified=true');
    }, 2000);
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
            <h1 className="text-xl font-semibold">Invalid Link</h1>
            <p className="text-muted-foreground">This verification link is invalid or expired.</p>
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
          <CheckCircle className="h-12 w-12 text-green-500" />
          <h1 className="text-xl font-semibold">Verification Successful!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
}