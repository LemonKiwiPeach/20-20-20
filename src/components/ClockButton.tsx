import React, { useState, useEffect } from 'react';
import '../styles/ClockButton.css';

interface ClockButtonProps {
  onClick: () => void;
  isToggled?: boolean;
  icon?: string;
  toggledIcon?: string;
  badgeNumber?: number;
}

const ClockButton: React.FC<ClockButtonProps> = ({
  onClick, //
  isToggled,
  icon,
  toggledIcon,
  badgeNumber,
}) => {
  return (
    <button onClick={onClick} className={isToggled ? 'toggled' : ''}>
      <i className={`fa ${isToggled && toggledIcon ? toggledIcon : icon}`}></i>
      {badgeNumber !== undefined && badgeNumber !== 0 && <span className="badge">{badgeNumber}</span>}
    </button>
  );
};

export default ClockButton;
