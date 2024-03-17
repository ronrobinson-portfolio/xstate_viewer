import React, { useEffect, useState } from 'react';
import { Alert, Toast, ToastContainer } from 'react-bootstrap';

export interface ToastMessage {
  id?: number;
  message: string;
  type: string;
}

interface StackedToastProps {
  message: string | ToastMessage | null;
  type?: string;
}

const StackedToast: React.FC<StackedToastProps> = ({ message }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (message) {
      addToast(message);
    }
  }, [message]);

  const addToast = (message: string | ToastMessage) => {
    if (typeof message === 'string') {
      // If message is a string, create a ToastMessage object
      const newToast: ToastMessage = {
        id: Date.now(),
        message,
        type: 'success',
      };
      setToasts((currentToasts) => [...currentToasts, newToast]);
    } else {
      // If message is already a ToastMessage object, ensure it has an id
      const newToast: ToastMessage = {
        ...message,
        id: message.id || Date.now(),
      };
      setToasts((currentToasts) => [...currentToasts, newToast]);
    }
  };

  const removeToast = (id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  };

  return (
    <ToastContainer
      className="p-3"
      position="top-center"
      style={{
        zIndex: 10,
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => removeToast(toast.id as number)}
          autohide
          delay={2000}
        >
          <Alert
            className={'m-0 text-center'}
            dismissible={true}
            variant={toast.type}
            onClose={() => removeToast(toast.id as number)}
          >
            {toast.message}
          </Alert>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default StackedToast;
