import styled from 'styled-components';

export const VolumeControlWrapper = styled.div`
  justify-content: center;
  position: relative;
`;

export const ControlButton = styled.div`
  justify-content: center;
  position: relative;
`;

export const VolumeSlider = styled.div`
  position: absolute;
  bottom: 4em;
  width: 20px;
  z-index: 1;

  input[type='range'] {
    cursor: pointer;
    width: 100px;
    height: 20px;
    overflow: hidden;
    transform: rotate(-90deg) translateX(-50%);
    transform-origin: top left;
  }
`;
