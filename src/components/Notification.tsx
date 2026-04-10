import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message?: string;
  visible?: boolean;
  onClose?: () => void;
}

export default function Notification({ message, visible, onClose }: NotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) setShow(true);
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  if (!show || !message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-overcomer text-white font-montserrat text-sm px-5 py-3 shadow-xl animate-fade-up">
      <span>{message}</span>
      <button onClick={handleClose} aria-label="Dismiss notification">
        <X className="w-4 h-4 opacity-80 hover:opacity-100" />
      </button>
    </div>
  );
}
