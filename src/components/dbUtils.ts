import { openDB, DBSchema } from 'idb';
import { DefaultSettings } from '../DefaultSettings';

interface AudioDB extends DBSchema {
  [DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME]: {
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

    const db = await openDB<AudioDB>(DefaultSettings.INDEXED_DB_NAME, 1, {
      upgrade(db) {
        console.log('Upgrade event triggered');
        if (!db.objectStoreNames.contains(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME)) {
          console.log('Creating INDEXED_DB_OBJECT_STORE_NAME object store');
          db.createObjectStore(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME);
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

    if (db.objectStoreNames.contains(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME)) {
      const tx = db.transaction(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME, 'readwrite');
      await tx.store.put(audioBlob, audioName);
    } else {
      console.error('The INDEXED_DB_OBJECT_STORE_NAME object store does not exist.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Read: Fetch an audio blob by its name
export const fetchAudioFromIndexedDB = async (audioName: string): Promise<Blob | undefined> => {
  let blob: Blob | undefined;
  try {
    const db = await openDB<AudioDB>(DefaultSettings.INDEXED_DB_NAME, 1);
    blob = await db.get(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME, audioName);
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return blob;
};

// Delete: Remove an audio blob by its name
export const deleteAudioFromIndexedDB = async (audioName: string): Promise<void> => {
  try {
    const db = await openDB<AudioDB>(DefaultSettings.INDEXED_DB_NAME, 1);
    const tx = db.transaction(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME, 'readwrite');
    await tx.store.delete(audioName);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Fetch all keys from the INDEXED_DB_OBJECT_STORE_NAME object store
export const fetchAllKeysFromAudioStore = async (): Promise<string[]> => {
  let keys: string[] = [];
  try {
    const audioExists = await checkIfAudioStoreExists();
    if (audioExists) {
      const db = await openDB<AudioDB>(DefaultSettings.INDEXED_DB_NAME, 1);
      keys = await db.getAllKeys(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME);
    } else {
      console.error('The INDEXED_DB_OBJECT_STORE_NAME object store does not exist.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return keys;
};

// Check if INDEXED_DB_OBJECT_STORE_NAME object store exists
export const checkIfAudioStoreExists = async (): Promise<boolean> => {
  try {
    const db = await openDB<AudioDB>(DefaultSettings.INDEXED_DB_NAME, 1);
    return db.objectStoreNames.contains(DefaultSettings.INDEXED_DB_OBJECT_STORE_NAME);
  } catch (error) {
    console.error('An error occurred:', error);
    return false;
  }
};
