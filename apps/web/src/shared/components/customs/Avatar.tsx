import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

interface AvatarProps {
  url?: string | null;
  size?: number; // width and height of the image
  iconSize?: number; // size of the default icon
  className?: string;
}

export default function Avatar({
  url,
  size = 40,
  iconSize,
  className,
}: Readonly<AvatarProps>) {
  const mounted = useMounted();
  // ponytail: automatically calculate icon size based on avatar size if not provided
  const calculatedIconSize = iconSize ?? Math.round(size * 0.36);

  if (mounted && url) {
    return (
      <Image
        src={url}
        alt="Avatar"
        width={size}
        height={size}
        className={cn("w-full h-full object-cover rounded-full", className)}
      />
    );
  }

  return (
    <UserRound
      size={calculatedIconSize}
      className={cn("text-secondary-text", className)}
    />
  );
}
