import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import {
  Slot,
  type WithAsChild,
} from "@/shared/components/animate-ui/primitives/animate/slot";

type MotionButtonProps = Omit<
  HTMLMotionProps<"button">,
  | "onAnimationStart"
  | "onDragStart"
  | "onDragEnd"
  | "onDrag"
  | "ref"
  | "children"
>;

export type PrimitiveButtonProps = WithAsChild<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    MotionButtonProps & {
      children?: React.ReactNode;
      hoverScale?: number;
      tapScale?: number;
    }
>;

const Button = React.forwardRef<HTMLButtonElement, PrimitiveButtonProps>(
  ({ hoverScale = 1.02, tapScale = 0.96, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : motion.button;

    return (
      <Component
        ref={ref}
        whileTap={{ scale: tapScale }}
        whileHover={{ scale: hoverScale }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      />
    );
  },
);

Button.displayName = "ButtonPrimitive";

export { Button, type PrimitiveButtonProps as ButtonProps };
