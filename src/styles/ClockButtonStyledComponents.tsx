import styled from 'styled-components';
import { TimerSettings } from '../TimerSettings';

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #f5f5f5;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b5b5b5;
  }

  .fa {
    color: #000;
  }

  &.toggled {
    background-color: #3498db;

    &:hover {
      background-color: #2980b9;
    }

    .fa {
      color: white;
    }
  }

  @media (max-width: ${TimerSettings.SMALL_SCREEN}px) {
    padding: 3px 6px;
  }
`;
