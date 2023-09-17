import React, { createContext, useContext, useState, useEffect } from 'react';
import { DefaultSettings } from '../DefaultSettings';

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
  notificationStartMessage: DefaultSettings.NOTIFICATION_BREAK_START,
  notificationFinishMessage: DefaultSettings.NOTIFICATION_BREAK_FINISH,
  notificationDisplayTime: DefaultSettings.NOTIFICATION_DISPLAY_TIME,
  alarmSound: DefaultSettings.ALARM_SOUND,
  alarmSounds: DefaultSettings.ALARM_SOUNDS,
  alarmVolume: DefaultSettings.ALARM_VOLUME,
  isContinuous: DefaultSettings.IS_CONTINUOUS,
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
