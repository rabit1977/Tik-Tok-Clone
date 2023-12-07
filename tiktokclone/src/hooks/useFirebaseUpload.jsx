import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { storage } from '../lib/firebase';

export default function useFirebaseUpload(user) {
  const [file, setFile] = useState(null);
  const [uploadTask, setUploadTask] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  function handleUpload(file) {
    const uploadId = nanoid();

    setFile(file);
    setUploading(true);

    const uploadTask = uploadBytesResumable(
      ref(storage, `uploads/${user.uid}/${uploadId}`),
      file
    );
    setUploadTask(uploadTask);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file', error);
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(ref(storage, `uploads/${user.uid}/${uploadId}`));
          setVideoUrl(url);
          setUploading(false);
        } catch (error) {
          console.error('Error getting download URL', error);
          setUploading(false);
        }
      }
    );
  }

  async function cancelUpload() {
    if (uploadTask) {
      setUploading(false);
      await uploadTask.cancel();
    }
  }

  function discardUpload() {
    setUploading(false);
    setUploadProgress(0);
    setVideoUrl('');
    setFile(null);
  }

  return {
    handleUpload,
    cancelUpload,
    discardUpload,
    file,
    videoUrl,
    isUploading,
    uploadProgress,
  };
}
