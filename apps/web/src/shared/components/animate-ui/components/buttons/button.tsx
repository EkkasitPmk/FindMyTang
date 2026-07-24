import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "@/shared/components/animate-ui/primitives/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/50",
        secondary:
          "bg-surface-secondary text-primary-text hover:bg-border/60 border border-border/50 focus-visible:ring-border",
        outline:
          "border border-border bg-surface text-primary-text hover:bg-surface-secondary focus-visible:ring-primary/50",
        ghost:
          "text-secondary-text hover:text-primary-text hover:bg-surface-secondary focus-visible:ring-primary/50",
        destructive:
          "bg-expense text-white hover:bg-expense/90 focus-visible:ring-expense/50",
        success:
          "bg-income text-white hover:bg-income/90 focus-visible:ring-income/50",
        investment:
          "bg-investment text-white hover:bg-investment/90 focus-visible:ring-investment/50",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
        unstyled: "",
      },
      size: {
        default: "h-8 gap-1.5 px-3 text-sm rounded-lg",
        xs: "h-6 gap-1 px-2 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4 text-base rounded-lg",
        icon: "size-8 p-0 rounded-lg",
        "icon-xs": "size-6 p-0 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 p-0 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<ButtonPrimitiveProps, "variant">,
    Omit<VariantProps<typeof buttonVariants>, "variant"> {
  variant?: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      hoverScale,
      tapScale,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    if (variant === "unstyled") {
      return (
        <ButtonPrimitive
          ref={ref}
          className={className}
          disabled={isLoading || disabled}
          hoverScale={hoverScale}
          tapScale={tapScale}
          asChild={asChild}
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
        </ButtonPrimitive>
      );
    }

    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading || disabled}
        hoverScale={hoverScale}
        tapScale={tapScale}
        asChild={asChild}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </ButtonPrimitive>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
