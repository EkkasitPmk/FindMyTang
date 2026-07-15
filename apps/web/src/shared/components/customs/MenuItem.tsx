import React from "react";

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MenuItem({
  className = "hover:bg-surface-secondary",
  children,
  ...props
}: Readonly<MenuItemProps>) {
  return (
    <button
      type="button"
      className={`py-2 px-3 w-full text-left ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
