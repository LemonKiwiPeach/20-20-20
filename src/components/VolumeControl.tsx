import React from 'react';
import { useSettings } from './SettingsContext';
import { VolumeContrlWrapper } from '../styles/VolumeControlStyledComponents';

interface VolumeControlProps {
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ onVolumeChange }) => {
  const { settings } = useSettings();

  const handleVolumeChange = () => {
    if (settings.alarmVolume === 0) {
      onVolumeChange(0.1);
    } else {
      onVolumeChange(0);
    }
  };

  return (
    <VolumeContrlWrapper onClick={handleVolumeChange}>
      <i className={`fa fa-2x ${settings.alarmVolume === 0 ? 'fa-volume-off' : 'fa-volume-up'}`}></i>
    </VolumeContrlWrapper>
  );
};

export default VolumeControl;
