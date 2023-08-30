import React, { useState, useEffect } from 'react';
import '../styles/ClockButton.css';

interface ClockButtonProps {
  onClick: () => void;
  isToggled?: boolean;
  icon?: string;
  toggledIcon?: string;
}

const ClockButton: React.FC<ClockButtonProps> = ({
  onClick, //
  isToggled,
  icon,
  toggledIcon,
}) => {
  return (
    <button onClick={onClick} className={isToggled ? 'toggled' : ''}>
      <i className={`fa ${isToggled && toggledIcon ? toggledIcon : icon}`}></i>
    </button>
  );
};

export default ClockButton;
