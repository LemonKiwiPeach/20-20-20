import { useRef } from 'react';
import { useSettings } from './SettingsContext';
import { openDB } from 'idb';

export const useAlarm = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { settings } = useSettings();

  async function startAlarm() {
    try {
      if (audioRef.current) {
        const db = await openDB('DB-20-20-20', 1);
        const file = await db.get('audio', settings.alarmSound);

        if (!file) {
          console.error('File not found in IndexedDB.');
          return;
        }

        if (!(file instanceof Blob) && !(file instanceof File)) {
          console.error('Retrieved item is not a File or Blob.');
          return;
        }

        audioRef.current.onerror = () => {
          console.error('Audio Error:', audioRef.current?.error);
        };

        const url = URL.createObjectURL(file);
        audioRef.current.src = url;
        audioRef.current.play();
        audioRef.current.volume = settings.alarmVolume;
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  function pauseAlarm() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  function resetAlarm() {
    if (audioRef.current) {
      pauseAlarm();
      audioRef.current.currentTime = 0;
    }
  }

  function adjustAlarmVolume(volume: number) {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }

  function setAlarmSound(alarmSound: string) {
    if (audioRef.current) {
      audioRef.current.src = alarmSound;
    }
  }

  return {
    audioRef, //
    startAlarm,
    pauseAlarm,
    resetAlarm,
    adjustAlarmVolume,
    setAlarmSound,
  };
};
