import React from "react";

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MenuItem({
  className = "hover:bg-gray-50",
  children,
  ...props
}: Readonly<MenuItemProps>) {
  return (
    <button
      type="button"
      className={`text-base py-1 px-3 w-full text-left ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
