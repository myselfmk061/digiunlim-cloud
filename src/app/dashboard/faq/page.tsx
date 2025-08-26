'use client';

import Link from 'next/link';
import { Cloud, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
    {
        question: "What is DigiUnLim Cloud?",
        answer: "DigiUnLim Cloud is a secure, unlimited cloud storage solution that allows you to upload, store, and share any file type with ease. It's powered by Telegram's robust infrastructure to ensure your data is always safe and accessible."
    },
    {
        question: "Is the storage really unlimited?",
        answer: "Yes! Our Free Forever plan provides unlimited file uploads and unlimited storage. You never have to worry about running out of space for your important files."
    },
    {
        question: "How secure is my data?",
        answer: "We leverage the world-class security and encryption of the Telegram network. Your data is protected with multiple layers of security to ensure it remains private and secure."
    },
    {
        question: "How do I share files?",
        answer: "You can easily generate secure, shareable links for your files and folders in just one click from your dashboard. You can share these links with anyone, even if they don't have a DigiUnLim Cloud account."
    },
    {
        question: "Is DigiUnLim Cloud really free?",
        answer: "Yes, our core service is completely free. We offer a 'Free Forever' plan that includes unlimited storage and all essential features. We believe everyone should have access to reliable cloud storage."
    },
    {
        question: "Can I access my files from a mobile device?",
        answer: "Absolutely. You can download our desktop application from the settings page to access your files from your computer. A mobile application is also in development."
    }
]

export default function FAQPage() {
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
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about our service.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6" /> General Questions
                </CardTitle>
                <CardDescription>
                    Information about the DigiUnLim Cloud platform.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
