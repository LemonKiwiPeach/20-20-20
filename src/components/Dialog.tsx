import React, { ReactNode, useEffect } from 'react';
import { DialogOverlay, DialogContent, CloseButton, Title } from '../styles/DialogStyledComponents';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dialogClassName: string;
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, dialogClassName, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = () => {
    onClose();
  };

  const handleDialogContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay onClick={handleOverlayClick}>
      <DialogContent className={dialogClassName} onClick={handleDialogContentClick}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>{title}</Title>
        {children}
      </DialogContent>
    </DialogOverlay>
  );
};

export default Dialog;
