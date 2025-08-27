
'use client';

import { useState, useRef, ChangeEvent, useEffect, Suspense } from 'react';
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
  Loader2,
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


function DashboardLoading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4">Loading Dashboard...</p>
        </div>
    )
}

function DashboardContent() {
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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const storedPhoneNumber = localStorage.getItem('userPhoneNumber');

    if (token && storedPhoneNumber) {
        setShowVerificationMessage(true);
        setTimeout(() => {
            setIsVerified(true);
            setShowVerificationMessage(false);
            router.replace('/dashboard', undefined);
        }, 2500);
    } else if (storedPhoneNumber) {
        setIsVerified(true);
    } else {
        router.push('/login');
    }

    if (storedPhoneNumber) {
      setUserPhoneNumber(storedPhoneNumber);
    }
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
    const storedFiles = localStorage.getItem('userFiles');
    if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Persist files to localStorage whenever they change
    if (files.length > 0 || localStorage.getItem('userFiles')) {
        localStorage.setItem('userFiles', JSON.stringify(files));
    }
  }, [files]);
  
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
    localStorage.removeItem('userFiles');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/');
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      uploadFiles(Array.from(event.target.files));
    }
  };
  
  const uploadFiles = async (fileList: File[]) => {
    setIsUploading(true);
    for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);

        const tempId = `temp-${Date.now()}`;
        const tempFile: AppFile = {
            id: tempId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            url: '#',
            progress: 'uploading'
        };
        setFiles(prev => [tempFile, ...prev]);

        try {
            const response = await fetch('/api/telegram', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const newFile = await response.json();
            setFiles(prev => prev.map(f => f.id === tempId ? newFile : f));
            toast({
                title: 'Upload Complete',
                description: `"${newFile.name}" has been successfully uploaded.`,
            });
        } catch (error) {
            console.error('Upload error:', error);
            setFiles(prev => prev.filter(f => f.id !== tempId)); // Remove temp file on error
            toast({
                title: 'Upload Failed',
                description: error instanceof Error ? error.message : `Could not upload "${file.name}".`,
                variant: 'destructive',
            });
        }
    }
    setIsUploading(false);
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

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
        const response = await fetch(`/api/telegram?messageId=${fileToDelete.telegramMessageId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete file.');
        }

        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete!.id));
        toast({
            title: 'File Deleted',
            description: `"${fileToDelete!.name}" has been permanently deleted.`,
            variant: 'destructive',
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: `Could not delete file. It might have been deleted already.`,
            variant: 'destructive',
        });
        // Optionally remove from UI even if Telegram deletion fails
        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete!.id));
    } finally {
        setFileToDelete(null);
    }
  };
  
  const handleShare = (file: AppFile) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const link = `${appUrl}/share/${file.id}/${encodeURIComponent(file.name)}`;
    setShareLink(link);
    setDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({ title: 'Copied to clipboard!', description: 'Share link has been copied.' });
  };
  
  const handleDownload = (file: AppFile) => {
    // The link will open in a new tab, and the browser will handle the download.
    window.open(`/api/telegram?fileId=${file.id}`, '_blank');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-8 w-8 text-primary" />;
    if (fileType.startsWith('text/')) return <FileText className="h-8 w-8 text-primary" />;
    if (fileType.includes('zip') || fileType.includes('archive') || fileType.includes('rar')) return <Archive className="h-8 w-8 text-primary" />;
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
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4">Verifying...</p>
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
            disabled={isUploading}
          />
          { isUploading ? (
            <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 font-semibold text-foreground">
                    Uploading files... Please wait.
                </p>
                <p className="text-sm text-muted-foreground">Your dashboard will update automatically.</p>
            </>
          ) : (
            <>
                <UploadCloud className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 font-semibold text-foreground">
                    Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground">Unlimited storage, any file type.</p>
            </>
          )}
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
            <Card key={file.id} className="overflow-hidden animate-pulse">
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

        {filteredFiles.length === 0 && searchTerm && (
          <div className="mt-16 text-center">
            <Search className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No files found</p>
            <p className="text-muted-foreground">Your search for "{searchTerm}" did not match any files.</p>
          </div>
        )}

        {files.length === 0 && !isUploading && (
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
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="mr-2 h-4 w-4" /> Download
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
              This action cannot be undone. This will permanently delete "{fileToDelete?.name}" from your storage.
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
                    Anyone with this link can view and download the file. This link is not secure.
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


export function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
