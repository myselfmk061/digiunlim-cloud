
'use client';

import Link from 'next/link';
import { Cloud, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">DigiUnLim Cloud</span>
        </Link>
      </header>

      <main className="container mx-auto flex-1 p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6" /> Terms and Conditions
                </CardTitle>
                <CardDescription>
                    Please read these terms carefully before using our service.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">1. Agreement to Terms</h2>
                    <p>By using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. We reserve the right to modify these terms at any time. Your continued use of the service constitutes your acceptance of such changes.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">2. Use of Service</h2>
                    <p>You agree to use our service for lawful purposes only and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of, this service by any third party. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our service.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">3. User Accounts</h2>
                    <p>To use certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">4. Intellectual Property</h2>
                    <p>All content included on this service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of DigiUnLim Cloud or its suppliers and protected by copyright and other laws.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">5. Termination</h2>
                    <p>We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
                    <p>In no event shall DigiUnLim Cloud, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">7. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.</p>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@digiunlim.cloud" className="text-primary underline">support@digiunlim.cloud</a>.</p>
                </section>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
