import styled from 'styled-components';
import { TimerSettings } from '../TimerSettings';

export const TwentyTwentyTwentyStyled = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #e0e8ff;
`;

export const CircleProgressContainer = styled.div`
  width: 100%;
  max-width: 500px;
  position: relative;
  pointer-events: none;

  @media (max-width: ${TimerSettings.SMALL_SCREEN}px) {
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

export const ControlButtonsTop = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 16px;
  pointer-events: all;

  i {
    width: 32px;
    height: 32px;
  }

  @media (max-width: ${TimerSettings.SMALL_SCREEN}px) {
    i {
      font-size: inherit;
    }
  }
`;

export const ControlButtonsBottom = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  pointer-events: auto;
  position: absolute;
  width: 100%;
  bottom: 15%;
`;
