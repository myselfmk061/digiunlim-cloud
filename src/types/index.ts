export interface AppFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  progress: 'uploading' | 'complete';
}
