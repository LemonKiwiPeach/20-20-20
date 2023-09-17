import { useState } from 'react';

const useDialog = (initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return { isOpen, openDialog, closeDialog };
};

export default useDialog;
