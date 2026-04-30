import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ msg, type = "error", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`cc-toast cc-toast--${type}`}>
      <span className="cc-toast__dot" />
      <span className="cc-toast__msg">{msg}</span>
      <button className="cc-toast__close" onClick={onDone}>✕</button>
    </div>
  );
};

export default Toast;
