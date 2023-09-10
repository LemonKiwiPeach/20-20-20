import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AudioDB extends DBSchema {
  audio: {
    key: string;
    value: Blob;
  };
}

// Create or Update: Add a new audio blob or update an existing one
export const upsertAudioToIndexedDB = async (audioBlob: Blob, audioName: string): Promise<void> => {
  try {
    if (audioBlob.size > 1000 * 1024) {
      console.error('File size exceeds 1000KB');
      return;
    }

    const db = await openDB<AudioDB>('DB-20-20-20', 1, {
      upgrade(db) {
        console.log('Upgrade event triggered');
        if (!db.objectStoreNames.contains('audio')) {
          console.log("Creating 'audio' object store");
          db.createObjectStore('audio');
        }
      },
      blocked() {
        console.log('Older version still in use.');
      },
      blocking() {
        console.log('Newer version to be used.');
      },
      terminated() {
        console.log('Database terminated.');
      },
    });

    if (db.objectStoreNames.contains('audio')) {
      const tx = db.transaction('audio', 'readwrite');
      await tx.store.put(audioBlob, audioName);
    } else {
      console.error("The 'audio' object store does not exist.");
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Read: Fetch an audio blob by its name
export const fetchAudioFromIndexedDB = async (audioName: string): Promise<Blob | undefined> => {
  let blob: Blob | undefined;
  try {
    const db = await openDB<AudioDB>('DB-20-20-20', 1);
    blob = await db.get('audio', audioName);
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return blob;
};

// Delete: Remove an audio blob by its name
export const deleteAudioFromIndexedDB = async (audioName: string): Promise<void> => {
  try {
    const db = await openDB<AudioDB>('DB-20-20-20', 1);
    const tx = db.transaction('audio', 'readwrite');
    await tx.store.delete(audioName);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Fetch all keys from the 'audio' object store
export const fetchAllKeysFromAudioStore = async (): Promise<string[]> => {
  let keys: string[] = [];
  try {
    const audioExists = await checkIfAudioStoreExists();
    if (audioExists) {
      const db = await openDB<AudioDB>('DB-20-20-20', 1);
      keys = await db.getAllKeys('audio');
    } else {
      console.error("The 'audio' object store does not exist.");
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return keys;
};

// Check if 'audio' object store exists
export const checkIfAudioStoreExists = async (): Promise<boolean> => {
  try {
    const db = await openDB<AudioDB>('DB-20-20-20', 1);
    return db.objectStoreNames.contains('audio');
  } catch (error) {
    console.error('An error occurred:', error);
    return false;
  }
};
