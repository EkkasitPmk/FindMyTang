import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import {
  Button as ShadcnButton,
  buttonVariants,
} from "@/shared/components/ui/button";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "variant"> {
  variant?: VariantProps<typeof buttonVariants>["variant"] | "unstyled";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    if (variant === "unstyled") {
      return (
        <button
          className={className}
          ref={ref}
          disabled={isLoading || disabled}
          {...props}
        >
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
          )}
          {!isLoading && leftIcon && (
            <span className="mr-2 inline-block">{leftIcon}</span>
          )}
          {children}
          {!isLoading && rightIcon && (
            <span className="ml-2 inline-block">{rightIcon}</span>
          )}
        </button>
      );
    }

    return (
      <ShadcnButton
        className={className}
        variant={variant}
        size={size}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </ShadcnButton>
    );
  },
);
Button.displayName = "Button";

export { Button };
