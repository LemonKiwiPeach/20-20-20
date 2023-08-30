import React from 'react';
import '../styles/Tooltip.css';

interface TooltipProps {
  label: string;
  toggledLabel?: string;
  isToggled?: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ label, toggledLabel, children, isToggled }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">
        <span>{isToggled ? toggledLabel : label}</span>
        <div className="tooltip-arrow"></div> {/* Arrow element */}
      </div>
    </div>
  );
};

export default Tooltip;
