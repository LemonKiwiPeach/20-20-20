import { useRef } from 'react';
import { useSettings } from './SettingsContext';

export const useAlarm = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { settings } = useSettings();

  function startAlarm() {
    if (audioRef.current) {
      audioRef.current.play(); // 休憩時間が始まるときに音楽を再生
      audioRef.current.volume = settings.alarmVolume;
    }
  }

  function stopAlarm() {
    if (audioRef.current) {
      audioRef.current.pause(); // 休憩時間が終わるときに音楽を停止
    }
  }

  function resetAlarm() {
    if (audioRef.current) {
      stopAlarm();
      audioRef.current.currentTime = 0; // 音楽の再生位置を初めに戻す
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
    stopAlarm,
    resetAlarm,
    adjustAlarmVolume,
    setAlarmSound,
  };
};
