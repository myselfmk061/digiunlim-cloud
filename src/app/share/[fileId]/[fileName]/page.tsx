
'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, File, Cloud, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SharePage() {
  const params = useParams();
  const fileId = params.fileId as string;
  const fileName = params.fileName ? decodeURIComponent(params.fileName as string) : null;

  const handleDownload = () => {
    if (fileId) {
      window.open(`/api/telegram?fileId=${fileId}`, '_blank');
    }
  };

  // Render a loading state until params are available
  if (!fileId || !fileName) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading file details...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 p-4">
        <header className="absolute top-0 flex h-16 w-full items-center justify-center px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <Cloud className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">DigiUnLim Cloud</span>
            </Link>
        </header>

        <main className="flex w-full max-w-md flex-col items-center">
            <Card className="w-full shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <File className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">You've received a file</CardTitle>
                    <CardDescription>
                        Click the button below to download the shared file.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-md border bg-background/50 p-4 text-center">
                        <p className="truncate font-medium">{fileName}</p>
                    </div>
                    <Button onClick={handleDownload} className="w-full" size="lg">
                        <Download className="mr-2 h-5 w-5" />
                        Download File
                    </Button>
                </CardContent>
            </Card>
        </main>

        <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
            <p>Shared via DigiUnLim Cloud. &copy; {new Date().getFullYear()}</p>
        </footer>
    </div>
  );
}
