import React from "react";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onKeyDown,
  error,
  required = false,
  style = {},
}) => {
  return (
    <div className="cc-input-wrapper" style={style}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="cc-input__required"> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={error ? "cc-input--error" : ""}
      />
      {error && <span className="cc-input__error-msg">{error}</span>}
    </div>
  );
};

export default Input;
