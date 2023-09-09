import React, { createContext, useContext, useState } from 'react';

interface Settings {
  notificationMessage: string;
  notificationDisplayTime: number;
  alarmSound: File | null;
  alarmTime: number;
  alarmVolume: number;
}

const defaultSettings: Settings = {
  notificationMessage: 'Default Message',
  notificationDisplayTime: 5,
  alarmSound: null,
  alarmTime: 20,
  alarmVolume: 0.5,
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
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
};
