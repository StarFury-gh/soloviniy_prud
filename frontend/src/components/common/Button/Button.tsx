import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "outline" | "text";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconOnly?: boolean;
  children: ReactNode;
}

const variantStyles = {
  primary: styles.primary,
  secondary: styles.secondary,
  outline: styles.outline,
  text: styles.text,
};

const sizeStyles = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      iconOnly = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? styles.fullWidth : ""} ${iconOnly ? styles.iconOnly : ""} ${className || ""}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
