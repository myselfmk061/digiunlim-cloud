'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Cloud,
  File as FileIcon,
  UploadCloud,
  LogOut,
  User,
  MoreVertical,
  Share2,
  Download,
  Trash2,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  Archive,
  Settings,
  Search,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { AppFile } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [fileToDelete, setFileToDelete] = useState<AppFile | null>(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>('https://picsum.photos/100/100');
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const storedPhoneNumber = localStorage.getItem('userPhoneNumber');

    if (token && storedPhoneNumber) {
        setShowVerificationMessage(true);
        // Simulate verification and show dashboard after a delay
        setTimeout(() => {
            setIsVerified(true);
            setShowVerificationMessage(false);
            // Clean the URL
            router.replace('/dashboard', undefined);
        }, 2500);
    } else if (storedPhoneNumber) {
        // If user is already "logged in" (has phone number) but no token, show dashboard
        setIsVerified(true);
    } else {
        // If no phone number, redirect to login
        router.push('/login');
    }

    if (storedPhoneNumber) {
      setUserPhoneNumber(storedPhoneNumber);
    }
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, [searchParams, router]);
  
  const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setProfilePic(dataUrl);
        localStorage.setItem('profilePic', dataUrl);
        toast({ title: 'Profile photo updated!' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userPhoneNumber');
    localStorage.removeItem('profilePic');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/');
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      uploadFiles(Array.from(event.target.files));
    }
  };
  
  const uploadFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const newFile: AppFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        url: '#',
        progress: 'uploading',
      };

      setFiles((prev) => [newFile, ...prev]);

      // Simulate upload
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress: 'complete' } : f))
        );
        toast({
          title: 'Upload Complete',
          description: `"${newFile.name}" has been successfully uploaded.`,
        });
      }, 2000 + Math.random() * 3000);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleDelete = (file: AppFile) => {
    setFileToDelete(file);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      toast({
        title: 'File Deleted',
        description: `"${fileToDelete.name}" has been permanently deleted.`,
        variant: 'destructive',
      });
      setFileToDelete(null);
    }
  };
  
  const handleShare = (file: AppFile) => {
    const link = `https://digiunlim.cloud/share/${file.id}/${encodeURIComponent(file.name)}`;
    setShareLink(link);
    setDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({ title: 'Copied to clipboard!', description: 'Share link has been copied.' });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('text/')) return <FileText className="h-8 w-8 text-primary" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="h-8 w-8 text-primary" />;
    return <FileIcon className="h-8 w-8 text-primary" />;
  };
  
  const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (showVerificationMessage) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Card className="p-8 text-center shadow-2xl">
                <CardContent className="flex flex-col items-center gap-4">
                    <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
                    <h1 className="text-2xl font-bold">Successfully verified By Telegram</h1>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!isVerified) {
    // You can show a loading spinner here while verifying
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <p>Loading...</p>
        </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
        <input
            type="file"
            ref={profilePicInputRef}
            onChange={handleProfilePicChange}
            className="hidden"
            accept="image/*"
        />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">DigiUnLim Cloud</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={profilePic ?? undefined} alt="@user" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => profilePicInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              Change Photo
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="container mx-auto flex-1 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          {userPhoneNumber && <p className="text-muted-foreground">Signed in as {userPhoneNumber}</p>}
        </div>
        <div
          className={`relative mb-8 cursor-pointer rounded-lg border-2 border-dashed border-primary/50 bg-background p-8 text-center transition-colors duration-300 hover:border-primary hover:bg-primary/5 ${
            isDragging ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <UploadCloud className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 font-semibold text-foreground">
            Drag & drop files here, or click to select files
          </p>
          <p className="text-sm text-muted-foreground">Unlimited storage, any file type.</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Files</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {files.filter(f => f.progress === 'uploading').map(file => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
                <Progress value={50} className="h-2 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {files.length > 0 && filteredFiles.length === 0 && searchTerm && (
          <div className="mt-16 text-center">
            <Search className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No files found</p>
            <p className="text-muted-foreground">Your search for "{searchTerm}" did not match any files.</p>
          </div>
        )}

        {files.length === 0 && (
          <div className="mt-16 text-center">
            <FileIcon className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No files uploaded yet</p>
            <p className="text-muted-foreground">Start by uploading your first file!</p>
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFiles.filter(f => f.progress === 'complete').map(file => (
            <Card key={file.id} className="group relative">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="mb-4">{getFileIcon(file.type)}</div>
                <p className="w-full truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </CardContent>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(file)}>
                      <Share2 className="mr-2 h-4 w-4" /> Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <a href={file.url} download={file.name}>
                            <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(file)} className="text-red-500 focus:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </Card>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{fileToDelete?.name}" and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Share File</DialogTitle>
                <DialogDescription>
                    Anyone with this link can view and download the file.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="share-link">Shareable Link</Label>
                    <div className="flex gap-2">
                        <Input id="share-link" value={shareLink} readOnly />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
