import {
  Checkbox as CheckboxPrimitive,
  CheckboxIndicator as CheckboxIndicatorPrimitive,
  type CheckboxProps as CheckboxPrimitiveProps,
} from "@/shared/components/animate-ui/primitives/radix/checkbox";
import { cn } from "@/shared/lib/utils/core.util";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "peer shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 focus-visible:ring-offset-2 [&[data-state=checked],&[data-state=indeterminate]]:bg-primary [&[data-state=checked],&[data-state=indeterminate]]:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "bg-surface border border-border",
        accent: "bg-surface-secondary border border-border",
      },
      size: {
        default: "size-5 rounded-md",
        sm: "size-4.5 rounded-md",
        lg: "size-6 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const checkboxIndicatorVariants = cva("text-primary-foreground", {
  variants: {
    size: {
      default: "size-3.5",
      sm: "size-3",
      lg: "size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type CheckboxProps = CheckboxPrimitiveProps &
  VariantProps<typeof checkboxVariants>;

function Checkbox({
  className,
  children,
  variant,
  size,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive
      className={cn(checkboxVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      <CheckboxIndicatorPrimitive
        className={cn(checkboxIndicatorVariants({ size }))}
      />
    </CheckboxPrimitive>
  );
}

export { Checkbox, type CheckboxProps };
