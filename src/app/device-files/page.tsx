
'use client';

import AppShell from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/shared/Spinner';
import { FileItem } from '@/components/device-files/FileItem';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export interface Esp32File extends DocumentData {
  id: string;
  fileName: string;
  downloadURL: string;
  uploadedAt: Timestamp; // Firestore Timestamp
  deviceId?: string;
  contentType?: string; // e.g., 'image/jpeg'
}

export default function DeviceFilesPage() {
  const { user, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<Esp32File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      if (!authLoading) setLoading(false);
      return;
    }

    setLoading(true);
    // Query files from the 'esp32Files' collection, ordered by upload time
    const q = query(collection(db, 'esp32Files'), orderBy('uploadedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filesData: Esp32File[] = [];
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() } as Esp32File);
      });
      setFiles(filesData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching device files:", err);
      setError("Failed to load device files. Check console for details and ensure Firestore rules allow reads for 'esp32Files'.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, authLoading]);

  if (authLoading || (loading && !files.length)) {
    return (
      <AppShell>
        <PageHeader title="Device Files" description="View files uploaded from your ESP32 devices." />
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  if (!user) {
     return (
      <AppShell>
        <PageHeader title="Device Files" description="Please log in to view device files." />
         <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to view this page.
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }
  
  return (
    <AppShell>
      <PageHeader
        title="Device Files"
        description="View files uploaded from your ESP32 devices."
      />
      {error && (
         <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Files</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      {files.length === 0 && !loading && !error && (
        <Alert>
           <Terminal className="h-4 w-4" />
           <AlertTitle>No Files Found</AlertTitle>
          <AlertDescription>
            No files have been uploaded from your ESP32 devices yet, or there might be an issue fetching them.
            Ensure your ESP32 is uploading files and writing metadata to the 'esp32Files' Firestore collection.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </AppShell>
  );
}
