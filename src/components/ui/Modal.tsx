import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ModalProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  title?: string;
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  loading?: boolean;
  fullScreen?: boolean;
  topButton?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className = "",
  showCloseIcon = false,
  loading = false,
  fullScreen = false,
  topButton,
  fullWidth = false,
}) => {
  const widthClass = fullWidth
    ? "w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-none rounded-xl"
    : sizeClasses[size];

  return (
    <Dialog open={isOpen} onOpenChange={() => !loading && onClose()}>
      <DialogContent
        className={`overflow-hidden flex flex-col ${widthClass} ${className}`}
      >
        {(title || showCloseIcon) && (
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            {topButton}
          </DialogHeader>
        )}
        <div
          className={`overflow-auto px-1 dashboard-main-scroll ${fullWidth || fullScreen ? "flex-1" : "max-h-[75vh]"
            }`}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};