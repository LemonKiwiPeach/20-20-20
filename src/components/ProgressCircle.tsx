import React from 'react';
import '../styles/ProgressCircle.css';

interface ProgressCircleProps {
  strokeDashoffset: number;
  timerSeconds: number;
  isRunning: boolean;
  alarmTimeInSeconds: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ strokeDashoffset, timerSeconds, isRunning, alarmTimeInSeconds }) => {
  return (
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="95" fill="#e0e8ff" stroke="#e0e0e0" strokeWidth="10"></circle>
      <circle cx="100" cy="100" r="95" fill="none" stroke="#3498db" strokeWidth="10" className="progress-circle" style={{ strokeDashoffset }}></circle>
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
