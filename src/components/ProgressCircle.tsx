import React from 'react';
import { ProgressCircleStyled } from '../styles/ProgressCircleStyledComponents';
// Settings
import { TimerSettings } from '../TimerSettings';

interface ProgressCircleProps {
  timerSeconds: number;
  isRunning: boolean;
  breakTime: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ timerSeconds, isRunning, breakTime }) => {
  // Progress circle strokeDashoffset
  const progress =
    timerSeconds > 0
      ? // timer mode
        ((TimerSettings.TWENTY_MINUTES - timerSeconds) / TimerSettings.TWENTY_MINUTES) * TimerSettings.STROKE_LENGTH
      : // Alarm mode
        ((TimerSettings.BREAK_TIME - breakTime) / TimerSettings.BREAK_TIME) * TimerSettings.STROKE_LENGTH;
  const strokeDashoffset = TimerSettings.STROKE_LENGTH - progress;

  // Alarm time
  const alarmTime = new Date();
  const alarmTimeInSeconds = alarmTime.getHours() * 3600 + alarmTime.getMinutes() * 60 + alarmTime.getSeconds() + timerSeconds;

  return (
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="95" fill="#e0e8ff" stroke="#e0e0e0" strokeWidth="10"></circle>
      <ProgressCircleStyled cx="100" cy="100" r="95" fill="none" stroke="#3498db" strokeWidth="10" style={{ strokeDashoffset }}></ProgressCircleStyled>
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="30" fontFamily="Arial">
        {timerSeconds > 0 ? formatTime(timerSeconds) : formatTime(breakTime)}
      </text>
      <text x="50%" y="60%" dy=".3em" textAnchor="middle" fontSize="10" fontFamily="Arial" fill="gray">
        {isRunning && timerSeconds > 0 && formatTime(alarmTimeInSeconds)}
      </text>
    </svg>
  );
};

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default ProgressCircle;
