import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimerSettings } from '../TimerSettings';

export interface Settings {
  notificationStartMessage: string;
  notificationFinishMessage: string;
  notificationDisplayTime: number;
  alarmSound: string;
  alarmSounds: string[];
  alarmVolume: number;
  isContinuous: boolean;
}

const defaultSettings: Settings = {
  notificationStartMessage: TimerSettings.NOTIFICATION_BREAK_START,
  notificationFinishMessage: TimerSettings.NOTIFICATION_BREAK_FINISH,
  notificationDisplayTime: TimerSettings.NOTIFICATION_DISPLAY_TIME,
  alarmSound: TimerSettings.ALARM_SOUND,
  alarmSounds: TimerSettings.ALARM_SOUNDS,
  alarmVolume: TimerSettings.ALARM_VOLUME,
  isContinuous: TimerSettings.IS_CONTINUOUS,
};

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {/*  */}
      {children}
    </SettingsContext.Provider>
  );
};
