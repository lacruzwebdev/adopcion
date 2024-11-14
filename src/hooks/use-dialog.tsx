import { useCallback, useState } from "react";

export default function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);
  const toggleDialog = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return { isOpen, openDialog, closeDialog, toggleDialog };
}
