
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Loader2, Phone, Send, ShieldCheck, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const FormSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required.'),
  phoneNumber: z.string().min(5, {
    message: 'Please enter a valid phone number.'
  }),
});

const OtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});


const countryCodes = [
    { value: '+91', label: '🇮🇳 +91' },
    { value: '+1', label: '🇺🇸 +1' },
    { value: '+44', label: '🇬🇧 +44' },
    { value: '+61', label: '🇦🇺 +61' },
    { value: '+81', label: '🇯🇵 +81' },
    { value: '+49', label: '🇩🇪 +49' },
    { value: '+7', label: '🇷🇺 +7' },
    { value: '+33', label: '🇫🇷 +33' },
    { value: '+39', label: '🇮🇹 +39' },
    { value: '+52', label: '🇲🇽 +52' },
    { value: '+55', label: '🇧🇷 +55' },
    { value: '+86', label: '🇨🇳 +86' },
    { value: '+34', label: '🇪🇸 +34' },
    { value: '+92', label: '🇵🇰 +92' },
    { value: '+880', label: '🇧🇩 +880' },
    { value: '+20', label: '🇪🇬 +20' },
    { value: '+234', label: '🇳🇬 +234' },
    { value: '+971', label: '🇦🇪 +971' },
    { value: '+966', label: '🇸🇦 +966' },
    { value: '+27', label: '🇿🇦 +27' },
    { value: '+60', label: '🇲🇾 +60' },
    { value: '+62', label: '🇮🇩 +62' },
    { value: '+63', label: '🇵🇭 +63' },
    { value: '+65', label: '🇸🇬 +65' },
    { value: '+66', label: '🇹🇭 +66' },
    { value: '+82', label: '🇰🇷 +82' },
    { value: '+84', label: '🇻🇳 +84' },
];


export function LoginForm() {
  const [step, setStep] = useState<'agreement' | 'form' | 'action_required' | 'otp' | 'verified'>('agreement');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(null);
  const verificationBotUsername = process.env.NEXT_PUBLIC_VERIFICATION_BOT_USERNAME || 'your_bot_username';
  const router = useRouter();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      countryCode: '+91',
      phoneNumber: '',
    },
  });

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: '',
    },
  });


  // Effect to handle polling for Telegram bot interaction
  useEffect(() => {
    if (loginToken && step === 'action_required') {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/auth/status?token=${loginToken}`);
          const data = await response.json();

          if (data.status === 'OTP_SENT') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            toast({
              title: 'OTP Sent!',
              description: 'Please check your Telegram messages for the OTP.',
            });
            setStep('otp');
          } else if (data.status === 'EXPIRED') {
             if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
             }
             toast({
                title: 'Link Expired',
                description: 'The verification link has expired. Please try again.',
                variant: 'destructive',
             });
             setStep('form');
             setLoginToken(null);
          }
          // If status is 'PENDING', do nothing and continue polling.
        } catch (error) {
          console.error('Polling error:', error);
           if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
           }
          toast({
            title: 'Error',
            description: 'Something went wrong during verification.',
            variant: 'destructive',
          });
          setStep('form');
          setLoginToken(null);
        }
      }, 2000); // Poll every 2 seconds
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loginToken, step, router, toast]);

  async function onPhoneSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    try {
        const response = await fetch('/api/auth/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              countryCode: data.countryCode,
              phoneNumber: data.phoneNumber,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to start login process.');
        }
        
        setLoginToken(result.token);
        setCurrentPhoneNumber(result.phoneNumber);
        setStep('action_required');
        
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Could not start login process. Please try again later.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function onOtpSubmit(data: z.infer<typeof OtpSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: loginToken, otp: data.otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'OTP verification failed.');
      }

      localStorage.setItem('userPhoneNumber', result.phoneNumber);
      setStep('verified');
      setTimeout(() => {
        router.push('/dashboard?verified=true');
      }, 2000);

    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (step === 'verified') {
    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h1 className="text-xl font-semibold">Verification Successful!</h1>
                <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
        </Card>
    );
  }

  if (step === 'otp') {
    return (
       <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Enter Verification Code</CardTitle>
            <CardDescription>
                A 6-digit OTP has been sent to your Telegram account.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                    <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                     <Button variant="link" className="w-full text-muted-foreground" onClick={() => setStep('action_required')}>
                        Didn't get a code?
                    </Button>
                </form>
            </Form>
        </CardContent>
       </Card>
    )
  }
  
  if (step === 'action_required') {
      const botLink = `https://t.me/${verificationBotUsername}?start=${loginToken}`;
      return (
          <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Send className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Start a Chat on Telegram</CardTitle>
                  <CardDescription>
                      Click the button below to open Telegram and press "Start" to receive your OTP.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <a href={botLink} target="_blank" rel="noopener noreferrer">
                        <Send className="mr-2 h-4 w-4" /> Open Telegram
                    </a>
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <p className="text-xs text-center">
                        Waiting for you to start the chat...
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                      setStep('form');
                      setLoginToken(null);
                  }}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                  </Button>
              </CardContent>
          </Card>
      );
  }

  if (step === 'agreement') {
    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                 <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Info className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Login Requirements</CardTitle>
                <CardDescription>
                    Please read the following before you proceed.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-left dark:bg-blue-900/20">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📋 Requirements:</h3>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-300 list-disc list-inside">
                        <li>An active Telegram account.</li>
                        <li>The phone number must be linked to your Telegram.</li>
                    </ul>
                </div>
                
                <Button className="w-full" onClick={() => setStep('form')}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> I Understand, Continue
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Cloud className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to DigiUnLim Cloud</CardTitle>
        <CardDescription>
          Enter your phone number to receive a verification code on Telegram.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPhoneSubmit)} className="space-y-6">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-72">
                            {countryCodes.map((country) => (
                               <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                            ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="98765 43210" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
            <Button variant="link" className="w-full text-muted-foreground" onClick={() => setStep('agreement')}>
              Back to Requirements
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
