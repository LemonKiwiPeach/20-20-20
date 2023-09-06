import React, { ReactNode, useEffect } from "react";

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
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className={`${dialogClassName} dialog-content`} onClick={handleDialogContentClick}>
        <div className="close-button" onClick={onClose}>
          ×
        </div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
