
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Cloud, FileLock, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">DigiUnLim Cloud</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="text-foreground/80 transition-colors hover:text-foreground"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-foreground/80 transition-colors hover:text-foreground"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="text-foreground/80 transition-colors hover:text-foreground"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
        <Button asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative py-12 md:py-24 lg:py-32">
            <div className="absolute inset-0 -z-10 bg-primary/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Secure, Unlimited Cloud Storage
              </h1>
              <p className="text-lg text-foreground/80 md:text-xl">
                Upload, store, and share any file type with ease. Your data is always safe and accessible, powered by Telegram's robust infrastructure.
              </p>
              <div>
                <Button size="lg" asChild>
                  <Link href="/login">Upload Your First File</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose DigiUnLim Cloud?</h2>
              <p className="mx-auto max-w-2xl text-foreground/80 md:text-xl">
                We provide a feature-rich experience for all your storage needs.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Cloud className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Unlimited Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Never worry about running out of space. Upload any file, any size, any time.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileLock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Telegram-Powered Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Leverage the world-class security and encryption of the Telegram network.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy File Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Generate secure, shareable links for your files and folders in just one click.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mx-auto max-w-2xl text-foreground/80 md:text-xl">
                One plan to rule them all. Absolutely free.
              </p>
            </div>
            <div className="mx-auto max-w-md">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">Free Forever</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-5xl font-bold">
                    $0<span className="text-lg font-normal text-foreground/80">/month</span>
                  </p>
                  <ul className="w-full space-y-2 text-foreground/90">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> Unlimited File Uploads
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> Unlimited Storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> Secure File Sharing
                    </li>
                     <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> Telegram Integration
                    </li>
                  </ul>
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/login">Sign Up Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="bg-secondary/50 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 gap-4">
          <div className="text-sm text-foreground/80 text-center md:text-left">
            <p>&copy; 2024 DigiUnLim Cloud. All rights reserved.</p>
            <p className="flex items-center justify-center md:justify-start gap-1">
              Made by - Myselfmk Apps | Powered by 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
                <path d="M9.78 18.65l.28-4.23l7.02-6.64c.38-.34.03-.94-.46-.69L5.31 13.13l-3.56-1.1c-.53-.17-.54-.95.02-1.13l15.58-5.9c.53-.2 1.02.26 1.02.82v12.2c0 .83-.93 1.22-1.5.78L12.03 15.9l-1.74 1.68c-.2.2-.47.26-.72.15z"/>
              </svg>
              Telegram
            </p>
          </div>
          <div className="flex gap-4">
             <Link href="/dashboard/privacy-policy" className="text-foreground/80 transition-colors hover:text-foreground" prefetch={false}>
              Privacy Policy
            </Link>
             <Link href="/dashboard/terms" className="text-foreground/80 transition-colors hover:text-foreground" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
