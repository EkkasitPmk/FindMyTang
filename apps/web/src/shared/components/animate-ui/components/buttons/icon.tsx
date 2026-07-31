import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "@/shared/components/animate-ui/primitives/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";
import {
  Particles,
  ParticlesEffect,
} from "@/shared/components/animate-ui/primitives/effects/particles";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/50",
        accent:
          "bg-primary-light text-primary-text hover:bg-surface-secondary focus-visible:ring-primary/50",
        destructive:
          "bg-expense text-white hover:bg-expense/90 focus-visible:ring-expense/50",
        outline:
          "border border-border bg-surface text-primary-text hover:bg-surface-secondary focus-visible:ring-primary/50",
        secondary:
          "bg-surface-secondary text-primary-text hover:bg-border/60 border border-border/50 focus-visible:ring-border",
        ghost:
          "text-secondary-text hover:text-primary-text hover:bg-surface-secondary focus-visible:ring-primary/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "size-8",
        xs: "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm: "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        lg: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type IconButtonProps = Omit<ButtonPrimitiveProps, "asChild"> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
  };

function IconButton({
  className,
  onClick,
  variant,
  size,
  children,
  ...props
}: IconButtonProps) {
  const [isActive, setIsActive] = React.useState(false);
  const [key, setKey] = React.useState(0);

  return (
    <Particles asChild animate={isActive} key={key}>
      <ButtonPrimitive
        data-slot="icon-button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={(e) => {
          setKey((prev) => prev + 1);
          setIsActive(true);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
        <ParticlesEffect
          data-variant={variant}
          className="bg-primary size-1 rounded-full"
        />
      </ButtonPrimitive>
    </Particles>
  );
}

export { IconButton, buttonVariants, type IconButtonProps };
