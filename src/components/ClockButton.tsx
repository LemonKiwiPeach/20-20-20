import React from 'react';
import '../styles/ClockButton.css';

interface ClockButtonProps {
  onClick: () => void;
  isToggled?: boolean;
  label: string;
  toggledLabel?: string;
}

const ClockButton: React.FC<ClockButtonProps> = ({ onClick, isToggled, label, toggledLabel }) => {
  return (
    <button onClick={onClick} className={isToggled ? 'toggled' : ''}>
      {isToggled && toggledLabel ? toggledLabel : label}
    </button>
  );
};

export default ClockButton;
