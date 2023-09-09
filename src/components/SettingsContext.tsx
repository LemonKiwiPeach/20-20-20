import React, { createContext, useContext, useState } from 'react';
import { TimerSettings } from '../TimerSettings';

interface Settings {
  notificationStartMessage: string;
  notificationFinishMessage: string;
  notificationDisplayTime: number;
  alarmSound: string;
  alarmTime: number;
  alarmVolume: number;
  isContinuous: boolean;
  repeatNumber: number;
}

const defaultSettings: Settings = {
  notificationStartMessage: TimerSettings.NOTIFICATION_BREAK_START,
  notificationFinishMessage: TimerSettings.NOTIFICATION_BREAK_FINISH,
  notificationDisplayTime: TimerSettings.NOTIFICATION_DISPLAY_TIME,
  alarmSound: TimerSettings.ALARM_SOUND,
  alarmTime: TimerSettings.ALARM_TIME,
  alarmVolume: TimerSettings.ALARM_VOLUME,
  isContinuous: TimerSettings.IS_CONTINUOUS,
  repeatNumber: TimerSettings.REPEAT_NUMBER,
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

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {/*  */}
      {children}
    </SettingsContext.Provider>
  );
};
