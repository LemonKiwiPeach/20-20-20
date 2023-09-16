import React from 'react';
import { TooltipContainer, TooltipText, TooltipArrow } from '../styles/TooltipStyledComponents';

interface TooltipProps {
  label: string;
  toggledLabel?: string;
  isToggled?: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ label, toggledLabel, children, isToggled }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipText>
        <span>{isToggled ? toggledLabel : label}</span>
        <TooltipArrow />
      </TooltipText>
    </TooltipContainer>
  );
};

export default Tooltip;
