import styled from 'styled-components';

export const SettingsContainer = styled.div`
  height: 400px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 2;
  gap: 16px 0;
`;

export const SettingsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0px 16px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;

export const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
`;

export const SettingsContent = styled.label`
  padding: 0 5px;
  flex-grow: 1;
`;

export const SettingsSection = styled.div`
  width: 100%;
  padding: 8px 0 8px 5px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }

  &.selected {
    background-color: #e0e8ff;
    font-weight: bold;
  }
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const Label = styled.label`
  width: 100%;
  font-weight: bold;
`;

export const CustomFileUpload = styled.label`
  width: 100%;
  display: inline-block;
  padding: 5px 10px !important;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
`;

export const DefaultFileUpload = styled.input`
  display: none;
`;

export const ToggleButton = styled.button`
  background-color: #b5b5b5;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;

  &.active {
    background-color: #2980b9;
    color: white;
  }
`;

export const MessageBox = styled.div`
  position: fixed;
  top: -100%;
  right: 10px;
  z-index: 2000;
  border-radius: 8px;
  background: #3498db;
  padding: 10px;
  opacity: 0;

  &.show {
    animation: slideDownThenUp 3s ease-out forwards;
  }

  @keyframes slideDownThenUp {
    0% {
      top: -100%;
      opacity: 0;
    }
    15%,
    55% {
      top: 10px;
      opacity: 1;
    }
    70% {
      top: 15px;
      opacity: 1;
    }
    100% {
      top: -100%;
      opacity: 0;
    }
  }
`;

export const Caption = styled.div`
  font-size: 6px;
  text-align: right;
  color: #888;
  width: 100%;
  pointer-events: auto;

  @media (max-width: 768px) {
    bottom: 1%;
  }

  a {
    color: #3498db;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
