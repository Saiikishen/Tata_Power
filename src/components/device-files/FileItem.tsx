
'use client';

import type { Esp32File } from '@/app/device-files/page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface FileItemProps {
  file: Esp32File;
}

export function FileItem({ file }: FileItemProps) {
  const isImage = file.contentType?.startsWith('image/');
  const uploadedAtDate = file.uploadedAt?.toDate();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="truncate text-lg">{file.fileName || 'Untitled File'}</CardTitle>
        {file.deviceId && <CardDescription>Device: {file.deviceId}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-0">
        {isImage ? (
          <div className="relative w-full aspect-video bg-muted">
            <Image
              src={file.downloadURL}
              alt={file.fileName || 'Uploaded image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint="device sensor image"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground aspect-video w-full bg-muted/50">
            <FileText className="w-16 h-16 mb-2" />
            <p className="text-sm">{file.contentType || 'File'}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 space-y-2">
        <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {uploadedAtDate 
              ? `${formatDistanceToNow(uploadedAtDate, { addSuffix: true })}`
              : 'Unknown date'}
          </span>
           {file.contentType && (
             <span className="truncate max-w-[100px]">{file.contentType}</span>
           )}
        </div>
        <Button asChild variant="outline" className="w-full">
          <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
