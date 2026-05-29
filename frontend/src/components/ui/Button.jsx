import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  ariaLabel,
  className = "",
  disabled = false,
  isLoading = false,
  ...rest
}) => {
  const resolvedVariant =
    variant === "ghost"
      ? "btn-ghost"
      : variant === "soft"
        ? "btn-soft"
        : "btn-primary";

  const resolvedClassName = ["btn", resolvedVariant, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      className={resolvedClassName}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <span>Loading...</span> : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "ghost", "soft"]),
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default Button;
