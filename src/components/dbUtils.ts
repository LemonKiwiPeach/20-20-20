import { openDB } from 'idb';

export const saveAudioToIndexedDB = async (audioBlob: Blob, audioName: string): Promise<void> => {
  try {
    // Check the blob size in bytes (1KB = 1024 Bytes, 1000KB = 1000 * 1024 Bytes)
    if (audioBlob.size > 1000 * 1024) {
      console.error('File size exceeds 1000KB');
      return;
    }

    const db = await openDB('DB-20-20-20', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('audio')) {
          db.createObjectStore('audio');
        }
      },
    });

    const tx = db.transaction('audio', 'readwrite');
    await tx.store.put(audioBlob, audioName);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
