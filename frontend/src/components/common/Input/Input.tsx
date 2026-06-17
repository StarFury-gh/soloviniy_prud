import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./Input.module.css";

interface BaseProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

interface InputProps
  extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, "required"> {
  as?: "input";
}

interface TextareaProps
  extends
    BaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> {
  as: "textarea";
}

type Props = InputProps | TextareaProps;

function Input({
  label,
  hint,
  error,
  required,
  iconLeft,
  iconRight,
  as: As = "input",
  className = "",
  ...rest
}: Props) {
  const inputClasses = [
    styles.input,
    iconLeft ? styles.hasIconLeft : "",
    iconRight ? styles.hasIconRight : "",
    error ? styles.isError : "",
    As === "textarea" ? styles.textarea : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrap}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        {As === "textarea" ? (
          <textarea
            className={inputClasses}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={inputClasses}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Input;
