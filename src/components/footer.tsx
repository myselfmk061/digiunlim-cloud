import Link from 'next/link';

export function Footer() {
  return (
    <footer id="contact" className="bg-secondary/50 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 gap-4">
        <div className="text-sm text-foreground/80 text-center md:text-left">
          <p>&copy; 2025 DigiUnLim Cloud. All rights reserved.</p>
          <p className="flex items-center justify-center md:justify-start gap-1">
            Made in India 🇮🇳 Made by Myselfmk Apps📱Made for World 🌍
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
  );
}
