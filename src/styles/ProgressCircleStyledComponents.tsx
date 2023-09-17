import styled, { keyframes } from 'styled-components';
import { DefaultSettings } from '../DefaultSettings';

export const CircleProgressContainer = styled.div`
  width: 100%;
  max-width: 500px;
  position: relative;
  pointer-events: none;

  @media (max-width: ${DefaultSettings.SMALL_SCREEN}px) {
    width: 80%;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    width: 70%;
    max-width: 200px;
  }

  svg {
    width: 100%;
    height: auto;
    transform: rotate(-90deg);
  }

  text {
    transform: rotate(90deg);
    transform-origin: 50% 50%;
  }
`;

const drawCircle = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

export const ProgressCircleStyled = styled.circle`
  stroke-dasharray: 595;
  stroke-dashoffset: 595;
  transition: stroke-dashoffset 0.3s;
  animation: ${drawCircle} linear;
`;
