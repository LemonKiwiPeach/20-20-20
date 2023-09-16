import React from 'react';
import { Button } from '../styles/ClockButtonStyledComponents';

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
    <Button onClick={onClick} className={isToggled ? 'toggled' : ''}>
      <i className={`fa ${isToggled && toggledIcon ? toggledIcon : icon}`}></i>
    </Button>
  );
};

export default ClockButton;
