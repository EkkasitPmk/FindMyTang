import { ReactNode } from "react";

interface AssetIconWrapperProps {
  color?: string | null;
  children: ReactNode;
}

export function AssetIconWrapper({
  color,
  children,
}: Readonly<AssetIconWrapperProps>) {
  if (!color) {
    return (
      <span className="bg-surface-secondary p-2.5 rounded-full inline-flex items-center justify-center shrink-0">
        {children}
      </span>
    );
  }

  return (
    <span
      className="relative inline-flex items-center justify-center p-2.5 rounded-full overflow-hidden shrink-0"
      style={{ color }}
    >
      <span
        className="absolute inset-0 opacity-[0.15]"
        style={{ backgroundColor: color }}
      />
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}
