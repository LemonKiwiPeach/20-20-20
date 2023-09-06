import React, { useState } from 'react';
import '../styles/VolumeControl.css';
import "../styles/ControlButton.css";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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
    <div className="volume-control-wrapper">
      <div className="volume-control" onClick={toggleVolumeSlider}>
        <i className={`fa fa-2x ${volume === 0 ? 'fa-volume-off' : 'fa-volume-up'}`}></i>
        {showVolumeSlider && (
          <div className="volume-slider">
            <input type="range" id="volume" name="volume" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeControl;
