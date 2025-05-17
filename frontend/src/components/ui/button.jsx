import "./Button.css";

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
