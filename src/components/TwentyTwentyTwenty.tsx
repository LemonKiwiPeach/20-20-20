import React, { useState, useEffect } from 'react';
// Components
import InfoButton from './InfoButton';
import VolumeControl from './VolumeControl';
import ClockButton from './ClockButton';
import Tooltip from './Tooltip';
import ProgressCircle from './ProgressCircle';
import SettingButton from './SettingsButton';

// Styles
import { CircleProgressContainer, ControlButtonsTop, ControlButtonsBottom, TwentyTwentyTwentyStyled } from '../styles/TwentyTwentyTwentyStyledComponents';
import 'font-awesome/css/font-awesome.min.css';

// Settings
import { DefaultSettings } from '../DefaultSettings';

// Custom hooks
import { useTimer } from './useTimer';
import { useAlarm } from './useAlarm';
import { useLocalStorage } from './useLocalStorage';
import { useSettings, Settings } from './SettingsContext';

// IndexedDB
import { upsertAudioToIndexedDB, checkIfAudioStoreExists, fetchAllKeysFromAudioStore } from './dbUtils';

const TwentyTwentyTwenty = () => {
  const { settings, setSettings } = useSettings();
  // タイマーの残り時間
  const [initialTimerSeconds, setInitialTimerSeconds] = useLocalStorage<number>('remainingTimerSeconds', DefaultSettings.TWENTY_MINUTES);
  const { timerSeconds, setTimerSeconds, initTimer, breakTime, setBreakTime, startTimer, stopTimer, resetTimer, terminateTimer } = useTimer(initialTimerSeconds);
  // アプリが起動中かどうか
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // 通知が出たかどうか
  const [notified, setNotified] = useState<boolean>(false);
  const { audioRef, startAlarm, pauseAlarm, resetAlarm, adjustAlarmVolume } = useAlarm();

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    initTimer();
    return () => terminateTimer();
  }, []);

  // IndexedDB init
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
        const response = await fetch(process.env.PUBLIC_URL + '/default-alarm-sound.mp3');
        if (!response.ok) {
          console.error('Failed to fetch audio file');
          return;
        }
        const audioBlob = await response.blob();
        upsertAudioToIndexedDB(audioBlob, 'default-alarm-sound.mp3');
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    initializeData();
  }, []);

  // Event handlers
  useEffect(() => {
    const handleSpacebarPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          handleStartAndPauseButton();
          break;
        case 'KeyC':
          handleContinuousModeButton();
          break;
        case 'KeyR':
          if (!event.ctrlKey) {
            handleResetButton();
          }
          break;
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      setInitialTimerSeconds(timerSeconds);
    };

    window.addEventListener('keydown', handleSpacebarPress);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleSpacebarPress);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, settings.isContinuous, timerSeconds]);

  // Timer time checker
  useEffect(() => {
    if (timerSeconds === 0) {
      if (breakTime === 0) {
        sendNotification(settings.notificationStartMessage);
        startAlarm();
      } else if (breakTime >= DefaultSettings.TWENTY_SECONDS) {
        resetAlarm();
        sendNotification(settings.notificationFinishMessage);
        resetApp();
      }
    }
  }, [timerSeconds, breakTime]);

  useEffect(() => {
    if (isRunning) {
      console.log(`startTimer: ${breakTime}`);
      startTimer(timerSeconds, breakTime);
    } else {
      stopTimer();
      pauseAlarm();
    }
  }, [isRunning]);

  // Notification
  const sendNotification = (message: string) => {
    if (Notification.permission === 'granted' && !notified) {
      const notification = new Notification(message);
      setTimeout(() => {
        notification.close();
      }, settings.notificationDisplayTime);
    }
  };

  // Alarm volume
  const handleVolumeChange = (newVolume: number) => {
    updateSettings({ alarmVolume: newVolume });
    adjustAlarmVolume(newVolume);
  };

  // Start/pause button
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

  // Continuous mode button
  const handleContinuousModeButton = () => {
    const newIsContinuous = !settings.isContinuous;
    updateSettings({ isContinuous: newIsContinuous });
  };

  // Reset button
  const handleResetButton = () => {
    resetApp();
    setIsRunning(false);
  };

  // App reset button
  const resetApp = () => {
    setTimerSeconds(DefaultSettings.TWENTY_MINUTES);
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

  // Settings value update
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({
      ...settings,
      ...newSettings,
    });
  };

  return (
    <>
      <TwentyTwentyTwentyStyled className="twenty-tweny-twenty">
        <CircleProgressContainer>
          <ProgressCircle timerSeconds={timerSeconds} isRunning={isRunning} breakTime={breakTime} />

          <ControlButtonsTop>
            <VolumeControl onVolumeChange={handleVolumeChange} />
            <InfoButton />
            <SettingButton />
          </ControlButtonsTop>

          <ControlButtonsBottom>
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
          </ControlButtonsBottom>
        </CircleProgressContainer>
        <audio ref={audioRef} src={process.env.PUBLIC_URL + `/${settings.alarmSound}`} preload="auto"></audio>
      </TwentyTwentyTwentyStyled>
    </>
  );
};

export default TwentyTwentyTwenty;
