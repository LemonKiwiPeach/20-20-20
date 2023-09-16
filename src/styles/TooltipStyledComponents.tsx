import styled from 'styled-components';

export const TooltipText = styled.div`
  visibility: hidden;
  background-color: #fff;
  color: #000;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;

  span {
    margin: 0 5px 0 5px;
  }
`;

export const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

export const TooltipArrow = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -10px;
  border-width: 9px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  pointer-events: none;
`;
