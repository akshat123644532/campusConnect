import React from "react";
import "./Button.css";

/**
 * Button variants:
 *   primary  — red filled (default)
 *   ghost    — transparent + border
 *   danger   — red outline (for cancel/delete)
 *   muted    — dim, secondary action
 */
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  loading = false,
  type = "button",
  style = {},
}) => {
  return (
    <button
      type={type}
      className={[
        "cc-btn",
        `cc-btn--${variant}`,
        `cc-btn--${size}`,
        fullWidth ? "cc-btn--full" : "",
        loading ? "cc-btn--loading" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? <span className="cc-btn__spinner">■ ■ ■</span> : children}
    </button>
  );
};

export default Button;
