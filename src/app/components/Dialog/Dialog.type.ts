import { ReactNode } from "react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  closeOnOverlayClick?: boolean;
  title?: string;
}
