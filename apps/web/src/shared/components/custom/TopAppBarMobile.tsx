"use client";
import { cn } from "@/shared/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";

interface TopAppBarMobileProps {
  href: string;
  title: string;
}

export default function TopAppBarMobile({
  href,
  title,
}: Readonly<TopAppBarMobileProps>) {
  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const toggleEditingList = useCategoryUIStore(
    (state) => state.toggleEditingList,
  );

  return (
    <div
      className={cn(
        "flex items-center relative border-b border-gray-200 pb-2",
        title === "Category" && "justify-between",
      )}
    >
      <Link href={href} className="p-1 ml-1">
        <ChevronLeft size={24} />
      </Link>
      <span className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
        {title}
      </span>
      {title === "Category" && (
        <button
          type="button"
          onClick={toggleEditingList}
          className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors"
        >
          {isEditingList ? "Done" : "Edit"}
        </button>
      )}
    </div>
  );
}
