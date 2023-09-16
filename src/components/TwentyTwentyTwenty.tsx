import React, { useState, useEffect } from 'react';
import '../styles/TwentyTwentyTwenty.css';
import '../styles/Caption.css';
import 'font-awesome/css/font-awesome.min.css';
import { TimerSettings } from '../TimerSettings';
import InfoButton from './InfoButton';
import VolumeControl from './VolumeControl';
import ClockButton from './ClockButton';
import Tooltip from './Tooltip';
import ProgressCircle from './ProgressCircle';
import SettingButton from './SettingsButton';
import { useTimer } from './useTimer';
import { useAlarm } from './useAlarm';
import { useLocalStorage } from './useLocalStorage';
import { useSettings, Settings } from './SettingsContext';
import {
  upsertAudioToIndexedDB, //
  checkIfAudioStoreExists,
  fetchAllKeysFromAudioStore,
} from './dbUtils';

const TwentyTwentyTwenty = () => {
  const { settings, setSettings } = useSettings();
  // タイマーの残り時間
  const [initialTimerSeconds, setInitialTimerSeconds] = useLocalStorage<number>('remainingTimerSeconds', TimerSettings.TWENTY_MINUTES);
  const {
    timerSeconds, //
    setTimerSeconds,
    initTimer,
    breakTime,
    setBreakTime,
    startTimer,
    stopTimer,
    resetTimer,
    terminateTimer,
  } = useTimer(initialTimerSeconds);
  // アプリが起動中かどうか
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // 通知が出たかどうか
  const [notified, setNotified] = useState<boolean>(false);
  const {
    audioRef, //
    startAlarm,
    pauseAlarm,
    resetAlarm,
    adjustAlarmVolume,
  } = useAlarm();

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    initTimer();
    return () => terminateTimer();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      // 1. デフォルトのアラーム音を登録
      await registerDefaultAlarmSound();

      // 2. 'audio'テーブル（オブジェクトストア）が存在するか確認
      const exists = await checkIfAudioStoreExists();
      if (exists) {
        try {
          // 3. IndexedDBから全てのキーを取得
          const fetchedKeys = await fetchAllKeysFromAudioStore();
          updateSettings({ alarmSounds: fetchedKeys });
        } catch (error) {
          console.error('Error fetching IndexedDb keys:', error);
        }
      } else {
        console.error("The 'audio' object store does not exist.");
      }
    };

    const registerDefaultAlarmSound = async () => {
      try {
        // Fetch audio file from public folder
        const response = await fetch(process.env.PUBLIC_URL + '/break-music.mp3');
        if (!response.ok) {
          console.error('Failed to fetch audio file');
          return;
        }
        const audioBlob = await response.blob();
        upsertAudioToIndexedDB(audioBlob, 'break-music.mp3');
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const handleSpacebarPress = (event: KeyboardEvent) => {
      console.log(event.code);
      switch (event.code) {
        case 'Space':
          handleStartAndPauseButton();
          break;
        case 'KeyC':
          handleContinuousModeButton();
          break;
        case 'KeyR':
          handleResetButton();
          break;
      }
    };

    window.addEventListener('keydown', handleSpacebarPress);

    return () => window.removeEventListener('keydown', handleSpacebarPress);
  }, [isRunning, settings.isContinuous]);

  useEffect(() => {
    const handleBeforeUnload = () => setInitialTimerSeconds(timerSeconds);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timerSeconds]);

  useEffect(() => {
    if (timerSeconds === 0) {
      if (breakTime === 0) {
        sendNotification(settings.notificationStartMessage);
        startAlarm();
      } else if (breakTime >= TimerSettings.BREAK_TIME) {
        resetAlarm();
        sendNotification(settings.notificationFinishMessage);
        resetApp();
      }
    }
  }, [timerSeconds, breakTime]);

  useEffect(() => {
    if (isRunning) {
      startTimer(timerSeconds, breakTime);
    } else {
      stopTimer();
      pauseAlarm();
    }
  }, [isRunning]);

  const progress =
    timerSeconds > 0 //
      ? ((TimerSettings.TWENTY_MINUTES - timerSeconds) / TimerSettings.TWENTY_MINUTES) * TimerSettings.STROKE_LENGTH
      : ((TimerSettings.BREAK_TIME - breakTime) / TimerSettings.BREAK_TIME) * TimerSettings.STROKE_LENGTH;
  const strokeDashoffset = TimerSettings.STROKE_LENGTH - progress;

  const sendNotification = (message: string) => {
    if (Notification.permission === 'granted' && !notified) {
      const notification = new Notification(message);
      setTimeout(() => {
        notification.close();
      }, settings.notificationDisplayTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    updateSettings({ alarmVolume: newVolume });
    adjustAlarmVolume(newVolume);
  };

  const handleStartAndPauseButton = () => {
    setIsRunning(!isRunning);

    if (timerSeconds === 0) {
      if (breakTime > 0) {
        isRunning ? pauseAlarm() : startAlarm();
      }
    } else {
      if (isRunning) {
        pauseAlarm();
      }
    }
  };

  const handleContinuousModeButton = () => {
    const newIsContinuous = !settings.isContinuous;
    updateSettings({ isContinuous: newIsContinuous });
  };

  const handleResetButton = () => {
    resetApp();
    setIsRunning(false);
  };

  const resetApp = () => {
    setTimerSeconds(TimerSettings.TWENTY_MINUTES);
    setBreakTime(0);
    resetAlarm();

    if (settings.isContinuous && isRunning) {
      resetTimer();
    } else {
      setIsRunning(false);
      setNotified(false);
      stopTimer();
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({
      ...settings,
      ...newSettings,
    });
  };

  const alarmTime = new Date();
  const alarmTimeInSeconds =
    alarmTime.getHours() * 3600 + //
    alarmTime.getMinutes() * 60 +
    alarmTime.getSeconds() +
    timerSeconds;

  return (
    <>
      <div className="twenty-tweny-twenty">
        <div className="circle-progress-container">
          <ProgressCircle
            strokeDashoffset={strokeDashoffset} //
            timerSeconds={timerSeconds}
            isRunning={isRunning}
            alarmTimeInSeconds={alarmTimeInSeconds}
            breakTime={breakTime}
          />

          <div className="control-buttons-top">
            <VolumeControl onVolumeChange={handleVolumeChange} />
            <InfoButton />
            <SettingButton />
          </div>

          <div className="control-buttons-bottom">
            {/* Start and paue button */}
            <Tooltip label="Start" toggledLabel="Pause" isToggled={isRunning}>
              <ClockButton
                onClick={handleStartAndPauseButton} //
                isToggled={isRunning}
                icon="fa-play"
                toggledIcon="fa-pause"
              />
            </Tooltip>

            {/* Continuous button */}
            <Tooltip label="20-minute timer ↔ 20-second alarm">
              <ClockButton
                onClick={handleContinuousModeButton} //
                isToggled={settings.isContinuous}
                icon="fa-refresh"
              />
            </Tooltip>

            {/* Reset button */}
            <Tooltip label="Reset">
              <ClockButton
                onClick={handleResetButton} //
                icon="fa-rotate-left"
              />
            </Tooltip>
          </div>

        </div>
        <audio ref={audioRef} src={process.env.PUBLIC_URL + `/${settings.alarmSound}`} preload="auto"></audio>
      </div>
    </>
  );
};

export default TwentyTwentyTwenty;
