
import Link from 'next/link';
import { Cloud } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { MojoAuthLogin } from '@/components/mojoauth-login';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">DigiUnLim Cloud</span>
        </Link>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <MojoAuthLogin />
      </main>
      <Footer />
    </div>
  );
}
