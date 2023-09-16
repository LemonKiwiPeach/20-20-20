import React, { useState } from 'react';
import { useSettings } from './SettingsContext';
import {
  VolumeControlWrapper, //
  ControlButton,
  VolumeSlider,
} from '../styles/VolumeControlStyledComponents';

interface VolumeControlProps {
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ onVolumeChange }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { settings, setSettings } = useSettings();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(event.target.value));
  };

  const toggleVolumeSlider = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id !== 'volume') {
      setShowVolumeSlider(!showVolumeSlider);
    }
  };

  return (
    <VolumeControlWrapper>
      <ControlButton onClick={toggleVolumeSlider}>
        <i className={`fa fa-2x ${settings.alarmVolume === 0 ? 'fa-volume-off' : 'fa-volume-up'}`}></i>
        {showVolumeSlider && (
          <VolumeSlider>
            <input type="range" id="volume" name="volume" min="0" max="1" step="0.1" value={settings.alarmVolume} onChange={handleVolumeChange} />
          </VolumeSlider>
        )}
      </ControlButton>
    </VolumeControlWrapper>
  );
};

export default VolumeControl;
