'use client';

import Link from 'next/link';
import {
  Cloud,
  ChevronRight,
  Database,
  Search,
  Download,
  Info,
  HelpCircle,
  FileText,
  MessageSquare,
  RefreshCw,
  Trash2,
  Bell,
  HardDrive,
  Gift,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const [isStorageClaimed, setIsStorageClaimed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const { toast } = useToast();

    const handleClaimStorage = () => {
        setIsClaiming(true);
        setTimeout(() => {
            setIsStorageClaimed(true);
            setIsClaiming(false);
            toast({
                title: 'Congratulations! 🎉',
                description: 'You have claimed Unlimited Cloud Storage for free.',
            })
        }, 5000);
    }

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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and app preferences.</p>
        </div>

        <div className="grid gap-8">
          {/* Synchronization */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> <span>Synchronization</span>
                </div>
              </CardTitle>
              <CardDescription>Settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Automatic Sync</p>
                        <p className="text-sm text-muted-foreground">Keep your files synced across all devices.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                <Separator/>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified about file changes and updates.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
          </Card>

          {/* Data and Storage */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" /> <span>Data and Storage</span>
                </div>
              </CardTitle>
            </CardHeader>
             {isStorageClaimed ? (
                <CardContent className="text-center bg-green-500/10 p-6 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">Congratulations! 🎉</p>
                    <p className="text-muted-foreground text-green-600">You have claimed Unlimited Cloud Storage.</p>
                    <Button variant="outline" className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Free up space
                    </Button>
                </CardContent>
             ) : (
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-6">
                    <Gift className="h-12 w-12 text-primary"/>
                    <p className="font-semibold">You have a special gift!</p>
                    <p className="text-muted-foreground">Claim your free unlimited cloud storage now.</p>
                    <Button onClick={handleClaimStorage} disabled={isClaiming}>
                        {isClaiming ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Gift className="mr-2 h-4 w-4" />
                        )}
                        {isClaiming ? 'Claiming...' : 'Claim Now'}
                    </Button>
                </CardContent>
             )}
          </Card>

          {/* Search Optimization */}
          <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5" /> <span>Search Optimization</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Improve Search Accuracy</p>
                  <p className="text-sm text-muted-foreground">Allow indexing of file contents for faster, more accurate search results.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Mobile Version */}
          <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5" /> <span>Desktop Version</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p>Access your files on the go with our mobile app.</p>
                <Button asChild>
                    <a href="/downloads/digiunlim.apk" download>
                        <Download className="mr-2 h-4 w-4" /> Download APK
                    </a>
                </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" /> <span>About</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
                <Link href="#" className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50 px-2 rounded-md">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-muted-foreground"/>
                        <p>FAQ</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="#" className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50 px-2 rounded-md">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground"/>
                        <p>Contact Us</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="#" className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50 px-2 rounded-md">
                    <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground"/>
                        <p>Privacy Policy</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
