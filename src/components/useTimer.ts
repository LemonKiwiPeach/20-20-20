import React, { useState } from 'react';
import { TimerSettings } from '../TimerSettings';

export const useTimer = (initialSeconds: number) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(initialSeconds);
  const [breakTime, setBreakTime] = useState<number>(0);
  const timerWorkerRef = React.useRef<Worker | null>(null);

  function initTimer() {
    // Web Workerのインスタンス化
    timerWorkerRef.current = new Worker(`${process.env.PUBLIC_URL}/timerWorker.js`);
    // Web Workerからのメッセージを受信
    timerWorkerRef.current.addEventListener('message', (e) => {
      setTimerSeconds(e.data.seconds);
      setBreakTime(e.data.breakTime);
    });
  }
  function startTimer(seconds: number, breakTime: number) {
    timerWorkerRef.current?.postMessage({ command: 'start', seconds, breakTime });
  }

  function stopTimer() {
    timerWorkerRef.current?.postMessage({ command: 'stop' });
  }

  function resetTimer() {
    stopTimer();
    startTimer(TimerSettings.TWENTY_MINUTES, 0);
  }

  function terminateTimer() {
    timerWorkerRef.current?.postMessage({ command: 'terminate' });
  }

  return {
    timerSeconds, //
    setTimerSeconds,
    initTimer,
    breakTime,
    setBreakTime,
    startTimer,
    stopTimer,
    resetTimer,
    terminateTimer,
  };
};
