import React, { useEffect } from 'react';

/**
 * @param {{ open: boolean, type: 'success'|'error', message: string, onClose: ()=>void }} props
 */
const Toast = ({ open, type, message, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      <button className="toast-close" aria-label="Close" onClick={onClose}>×</button>
      <div className="toast-title">{type === 'error' ? 'Error' : 'Success'}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
