import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({
  addToast: (message, type = "info", duration = 4000) => { },
  removeToast: (id) => { },
});

const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "error":
      return (
        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "warning":
      return (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);

    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-slate-900 border-emerald-500/30 text-slate-200";
      case "error":
        return "bg-slate-900 border-rose-500/30 text-slate-200";
      case "warning":
        return "bg-slate-900 border-amber-500/30 text-slate-200";
      case "info":
      default:
        return "bg-slate-900 border-blue-500/30 text-slate-200";
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-slide-in-right transition-all duration-300 ${getTypeStyles(
              toast.type
            )}`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">
              <ToastIcon type={toast.type} />
            </div>

            <div className="flex-1 text-sm font-medium leading-5">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-auto inline-flex text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);