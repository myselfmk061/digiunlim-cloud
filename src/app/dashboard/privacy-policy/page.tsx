
'use client';

import Link from 'next/link';
import { Cloud, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Cloud Store</span>
        </Link>
      </header>

      <main className="container mx-auto flex-1 p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6" /> Privacy Policy for Cloud Store
                </CardTitle>
                <CardDescription>
                    Your privacy is important to us.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
                    <p>Welcome to Cloud Store. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at support@cloud.store.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">2. Information We Collect</h2>
                    <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and services, when you participate in activities on the Services or otherwise when you contact us.</p>
                    <p className="mt-2">The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Personal Information Provided by You.</strong> We collect phone numbers; names; email addresses; and other similar data.</li>
                        <li><strong>Files.</strong> We collect and store the files you upload, download, or access with the Services.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
                    <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.</p>
                     <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>To facilitate account creation and logon process.</li>
                        <li>To post testimonials.</li>
                        <li>Request feedback.</li>
                        <li>To enable user-to-user communications.</li>
                        <li>To manage user accounts.</li>
                        <li>To send administrative information to you.</li>
                        <li>To protect our Services.</li>
                        <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">4. Will Your Information Be Shared With Anyone?</h2>
                    <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                    <p className="mt-2">Specifically, we may need to process your data or share your personal information in the following situations: Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">5. Data Security</h2>
                    <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. We leverage the robust security infrastructure of Telegram to protect your files. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">6. Your Privacy Rights</h2>
                    <p>In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information.</p>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">7. Changes to This Privacy Policy</h2>
                    <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact Us</h2>
                    <p>If you have questions or comments about this notice, you may email us at <a href="mailto:support@cloud.store" className="text-primary underline">support@cloud.store</a>.</p>
                </section>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
