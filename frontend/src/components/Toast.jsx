import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const iconMap = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
  };
  const colorMap = {
    success: '#2e7d32',
    error: '#c62828',
    warning: '#f9a825',
    info: '#1565c0',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          minWidth: '300px',
          maxWidth: '380px',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${colorMap[toast.type]}30`,
              animation: 'slideInRight 0.3s ease',
            }}
          >
            <i
              className={`bi ${iconMap[toast.type]} fs-5`}
              style={{ color: colorMap[toast.type], flexShrink: 0 }}
            />
            <span className="flex-grow-1 fw-medium" style={{ fontSize: '0.9rem', color: '#222' }}>
              {toast.message}
            </span>
            <button
              className="btn-close"
              style={{ fontSize: '0.65rem' }}
              onClick={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
