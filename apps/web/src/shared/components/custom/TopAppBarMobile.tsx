import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface TopAppBarMobileProps {
  href: string;
  title: string;
}

export default function TopAppBarMobile({
  href,
  title,
}: Readonly<TopAppBarMobileProps>) {
  return (
    <div className="flex items-center relative border-b border-gray-200 pb-2">
      <Link href={href} className="p-1 ml-1">
        <ChevronLeft size={24} />
      </Link>
      <span className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
        {title}
      </span>
    </div>
  );
}
