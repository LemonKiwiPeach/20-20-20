import React, { useState, useEffect } from 'react';
import '../styles/TwentyTwentyTwenty.css';
import InfoButton from './InfoButton';
import ClockButton from './ClockButton';

const TWENTY_MINUTES = 1200;
const BREAK_TIME = 20;
const STROKE_LENGTH = 595;

function TwentyTwentyTwenty() {
  const [seconds, setSeconds] = useState<number>(TWENTY_MINUTES);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [notified, setNotified] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const initialMode = localStorage.getItem('isContinuousMode') === 'true';
  const [isContinuousMode, setIsContinuousMode] = useState<boolean>(initialMode);
  // 音楽の再生/停止を制御するための ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Notification.requestPermission();
    const storedMode = localStorage.getItem('isContinuousMode');
    if (storedMode) {
      setIsContinuousMode(storedMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isContinuousMode', isContinuousMode.toString());
  }, [isContinuousMode]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          setBreakTime((prevBreakTime) => prevBreakTime + 1);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds === 0 && breakTime === 0) {
      sendNotification('Break time starts');
    }

    if (seconds <= 0 && breakTime >= BREAK_TIME) {
      sendNotification('Break time is over!');
      resetTimer();
    }
  }, [seconds, breakTime, notified, isContinuousMode]);

  useEffect(() => {
    if (seconds === 0 && breakTime === 0) {
      audioRef.current?.play(); // 休憩時間が始まるときに音楽を再生
      audioRef.current!.volume = 1; // 音量を最大に設定
    }

    if (seconds <= 0 && breakTime >= BREAK_TIME) {
      if (audioRef && audioRef.current !== null && audioRef.current.currentTime !== undefined) {
        audioRef.current.pause(); // 休憩時間が終わるときに音楽を停止
        audioRef.current.currentTime = 0; // 音楽の再生位置を初めに戻す
      }
    }
  }, [seconds, breakTime]);

  // 休憩時間が進行するにつれて音量を減少させる
  useEffect(() => {
    if (seconds <= 0) {
      const volume = 1 - breakTime / BREAK_TIME;
      audioRef.current!.volume = volume;
    }
  }, [breakTime]);

  const progress =
    seconds > 0 //
      ? ((TWENTY_MINUTES - seconds) / TWENTY_MINUTES) * STROKE_LENGTH
      : ((BREAK_TIME - breakTime) / BREAK_TIME) * STROKE_LENGTH;
  const dashOffset = STROKE_LENGTH - progress;

  const handleToggle = () => {
    setIsPlay(!isPlay);
    setIsRunning(!isRunning);
  };

  const sendNotification = (message: string) => {
    if (Notification.permission === 'granted' && !notified) {
      const notification = new Notification(message);
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const resetTimer = () => {
    if (isContinuousMode) {
      setSeconds(TWENTY_MINUTES);
      setBreakTime(0);
    } else {
      setSeconds(TWENTY_MINUTES);
      setBreakTime(0);
      setIsRunning(false);
      setNotified(false);
      setIsPlay(false);
    }
  };

  return (
    <>
      <div className="circle-progress-container">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#e0e0e0" strokeWidth="10"></circle>
          <circle cx="100" cy="100" r="95" fill="none" stroke="#3498db" strokeWidth="10" className="progress-circle" style={{ strokeDashoffset: dashOffset }}></circle>
          <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="30" fontFamily="Arial">
            {seconds > 0 ? formatTime(seconds) : formatTime(BREAK_TIME - breakTime)}
          </text>
        </svg>
      </div>

      <div className="button-wrapper">
        <ClockButton onClick={handleToggle} isToggled={isPlay} label="Play" toggledLabel="Stop" />
        <ClockButton onClick={() => setIsContinuousMode(!isContinuousMode)} isToggled={isContinuousMode} label="Continuous Mode: OFF" toggledLabel="Continuous Mode: ON" />
        <ClockButton onClick={resetTimer} label="Reset" />
      </div>

      <audio ref={audioRef} src={process.env.PUBLIC_URL + '/break-music.mp3'} preload="auto"></audio>

      <p className="caption">
        Sound from{' '}
        <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer">
          Zapsplat.com
        </a>
      </p>
      <InfoButton />
    </>
  );
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default TwentyTwentyTwenty;
