'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';

declare global {
  interface Window {
    MojoAuth: any;
  }
}

export function MojoAuthLogin() {
  const mojoAuthRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load MojoAuth script
    const script = document.createElement('script');
    script.src = 'https://cdn.mojoauth.com/js/mojoauth.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.MojoAuth && mojoAuthRef.current) {
        const mojoauth = new window.MojoAuth('732a854d-81be-4691-8836-fe09c89521b3', {
          language: 'en',
          redirect_url: window.location.origin + '/dashboard',
          source: [{ type: 'phone', feature: 'otp' }]
        });

        mojoauth.signIn().then((payload: any) => {
          console.log('MojoAuth Login Success:', payload);
          
          // Store user data
          localStorage.setItem('userPhoneNumber', payload.user.identifier);
          localStorage.setItem('mojoAuthToken', payload.oauth.access_token);
          
          // Redirect to dashboard
          router.push('/dashboard?verified=true');
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Cloud className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to DigiUnLim Cloud</CardTitle>
        <CardDescription>
          Enter your phone number to receive OTP - No password required!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mojoAuthRef} id="mojoauth-passwordless-form"></div>
      </CardContent>
    </Card>
  );
}