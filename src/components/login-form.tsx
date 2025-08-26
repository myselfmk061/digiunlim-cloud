'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import { Cloud, Loader2, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const FormSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required.'),
  phoneNumber: z.string().min(8, {
    message: 'Phone number must be at least 8 digits.',
  }),
});

const countryCodes = [
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+7', label: '🇷🇺 +7' },
  { value: '+55', label: '🇧🇷 +55' },
];

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      countryCode: '+1',
      phoneNumber: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    // Simulate API call to send verification link
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In a real app, you would handle the response and wait for Telegram verification.
    // For this demo, we'll simulate a successful verification and redirect.

    toast({
      title: 'Verification Link Sent',
      description: `A login link has been sent to your Telegram account associated with ${data.countryCode} ${data.phoneNumber}. Please verify to continue.`,
    });
    
    // Simulate user verifying and being redirected
    setTimeout(() => {
        // Save user info to localStorage
        const fullPhoneNumber = `${data.countryCode} ${data.phoneNumber}`;
        localStorage.setItem('userPhoneNumber', fullPhoneNumber);

        setIsLoading(false);
        router.push('/dashboard');
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Cloud className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to DigiUnLim</CardTitle>
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
                        {countryCodes.map((country) => (
                           <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                        ))}
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
                        <Input placeholder="555 123 4567" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Sending Link...' : 'Send Verification Link'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
