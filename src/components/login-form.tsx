
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

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
import { Cloud, Loader2, Phone, Send, AlertTriangle, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const FormSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required.'),
  phoneNumber: z.string().min(5, {
    message: 'Please enter a valid phone number.'
  }),
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
  const [step, setStep] = useState<'agreement' | 'form' | 'sent'>('agreement');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<{ message: string; showBotLink: boolean }>({ message: '', showBotLink: false });
  const verificationBotUsername = process.env.NEXT_PUBLIC_VERIFICATION_BOT_USERNAME;


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      countryCode: '+91',
      phoneNumber: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setErrorState({ message: '', showBotLink: false });

    try {
        const response = await fetch('/api/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              countryCode: data.countryCode,
              phoneNumber: data.phoneNumber,
            }),
        });

        if (!response.ok) {
            let errorResult;
            try {
                errorResult = await response.json();
            } catch {
                throw new Error(`Server error: ${response.status}`);
            }
            const errorMessage = errorResult.error || 'Failed to send verification link.';
             if (response.status === 404 && errorMessage.includes('Could not send link')) {
                setErrorState({ message: errorMessage, showBotLink: true });
            } else {
                 toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
            return;
        }

        const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
        localStorage.setItem('userPhoneNumber', fullPhoneNumber);
        
        setStep('sent');
        
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Could not send verification link. Please try again later.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  if (step === 'sent') {
      return (
          <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Send className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Check your Telegram</CardTitle>
                  <CardDescription>
                      A secure login link has been sent to your account. Please click the link to continue to your dashboard.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setStep('form')}>
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
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-left dark:bg-amber-900/20">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">⚠️ Important:</h3>
                    <ul className="space-y-1 text-amber-800 dark:text-amber-300 list-disc list-inside">
                        <li>You must start a chat with our bot on Telegram before you can receive the link.</li>
                        <li>Check your Telegram messages for the verification link.</li>
                        <li>The link expires in 10 minutes.</li>
                    </ul>
                </div>
                <Button className="w-full" onClick={() => setStep('form')}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> I Agree, Continue
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
          Enter your phone number to receive a verification link on Telegram.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            {errorState.message && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Action Required</AlertTitle>
                    <AlertDescription>
                        {errorState.message}
                        {errorState.showBotLink && verificationBotUsername && (
                             <Button
                                variant="link"
                                className="p-0 h-auto mt-2"
                                asChild
                            >
                                <a href={`https://t.me/${verificationBotUsername}`} target="_blank" rel="noopener noreferrer">
                                    Click here to start a chat with the bot.
                                </a>
                            </Button>
                        )}
                    </AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Sending Link...' : 'Send Verification Link'}
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
