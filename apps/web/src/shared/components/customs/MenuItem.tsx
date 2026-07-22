import React from "react";
import { Button } from "@/shared/components/customs/Button";

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MenuItem({
  className = "hover:bg-surface-secondary",
  children,
  ...props
}: Readonly<MenuItemProps>) {
  return (
    <Button
      variant="unstyled"
      type="button"
      className={`py-2 px-3 w-full text-left ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
