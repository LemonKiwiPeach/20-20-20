import React, { useState, useEffect } from 'react';
import '../styles/TwentyTwentyTwenty.css';
import '../styles/ProgressCircle.css';
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
import { useSettings } from './SettingsContext';

const TwentyTwentyTwenty = () => {
  const { settings, setSettings } = useSettings();
  // タイマーの残り時間
  const [initialTimerSeconds, setInitialTimerSeconds] = useLocalStorage<number>('remainingTimerSeconds', TimerSettings.TWENTY_MINUTES);
  const { timerSeconds, setTimerSeconds, initTimer, breakTime, setBreakTime, startTimer, stopTimer, resetTimer, terminateTimer } = useTimer(initialTimerSeconds);
  // アプリが起動中かどうか
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // 通知が出たかどうか
  const [notified, setNotified] = useState<boolean>(false);
  // 連続モードがONかOFFか
  // const [initialMode, setStoredMode] = useLocalStorage<boolean>('isContinuousMode', true);
  // const [isContinuousMode, setIsContinuousMode] = useState<boolean>(true);
  // 音量
  const [storedVolume, setStoredVolume] = useLocalStorage<number>('volume', settings.alarmVolume);
  const [volume, setVolume] = useState<number>(storedVolume);
  const {
    audioRef, //
    startAlarm,
    stopAlarm,
    resetAlarm,
    adjustAlarmVolume,
  } = useAlarm(settings.alarmVolume);

  useEffect(() => {
    setSettings({
      ...settings, //
      alarmVolume: settings.alarmVolume,
    });
  }, [settings.alarmVolume]);

  useEffect(() => {
    Notification.requestPermission();
    // if (initialMode) {
    //   setIsContinuousMode(initialMode === true);
    // }
  }, []);

  useEffect(() => {
    initTimer();
    return () => {
      terminateTimer();
    };
  }, []);

  useEffect(() => {
    // ページがアンロードされる前に実行されるイベントを追加
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      setInitialTimerSeconds(timerSeconds);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // イベントをクリーンアップ
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timerSeconds]);

  // useEffect(() => {
  //   setStoredMode(isContinuousMode);
  //   setStoredVolume(volume);
  // }, [isContinuousMode, volume]);

  // useEffect(() => {
  //   setStoredVolume(volume);
  // }, [volume]);

  useEffect(() => {
    // タイマー20分経過してアラームが鳴り始めるとき
    if (timerSeconds === 0 && breakTime === 0) {
      sendNotification(settings.notificationStartMessage);
      startAlarm();
    }

    // タイマー20分経過してアラーム20秒も経過したとき
    if (timerSeconds === 0 && breakTime >= TimerSettings.BREAK_TIME) {
      if (audioRef && audioRef.current !== null && audioRef.current.currentTime !== undefined) {
        resetAlarm();
      }
      sendNotification(settings.notificationFinishMessage);
      resetApp();
    }
  }, [timerSeconds, breakTime, notified, settings.isContinuous]);

  useEffect(() => {
    if (isRunning) {
      startTimer(timerSeconds, breakTime);
    } else {
      stopTimer();
      stopAlarm();
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
    setSettings({
      ...settings, //
      alarmVolume: newVolume,
    });
    adjustAlarmVolume(newVolume);
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
            <Tooltip label="Start" toggledLabel="Pause" isToggled={isRunning}>
              <ClockButton
                onClick={() => {
                  setIsRunning(!isRunning);
                  breakTime > 0 ? startAlarm() : stopAlarm();
                }} //
                isToggled={isRunning}
                icon="fa-play"
                toggledIcon="fa-pause"
              />
            </Tooltip>

            <Tooltip label="20-minute timer ↔ 20-second alarm">
              <ClockButton
                onClick={() => {
                  const newIsContinuous = !settings.isContinuous;
                  setSettings({
                    ...settings,
                    isContinuous: newIsContinuous,
                  });
                }}
                isToggled={settings.isContinuous}
                icon="fa-refresh"
              />
            </Tooltip>

            <Tooltip label="Reset">
              <ClockButton
                onClick={() => {
                  resetApp();
                  setIsRunning(false);
                }} //
                icon="fa-rotate-left"
              />
            </Tooltip>
          </div>

          <p className="caption">
            Sound from
            <br />
            <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer">
              Zapsplat.com
            </a>
          </p>
        </div>
        <audio ref={audioRef} src={process.env.PUBLIC_URL + `/${settings.alarmSound}`} preload="auto"></audio>
      </div>
    </>
  );
};

export default TwentyTwentyTwenty;
