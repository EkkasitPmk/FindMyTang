import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Input } from "@/shared/components/customs/Input";
import { X } from "lucide-react";
import { MainLayoutSearchBarProps } from "../types/main-layout.type";

export default function MainLayoutSearchBar({
  searchKeyword,
  onSearchKeywordChange,
  onCloseSearch,
  placeholder,
}: Readonly<MainLayoutSearchBarProps>) {
  return (
    <div className="sticky top-0 flex items-center px-4 pb-2 pt-2 z-40 bg-background/90 backdrop-blur-sm border-b border-border/50 h-14">
      <Input
        autoFocus
        placeholder={placeholder}
        value={searchKeyword}
        onChange={(e) => onSearchKeywordChange(e.target.value)}
        className="h-8 text-sm flex-1 bg-surface"
      />
      <Button
        variant="unstyled"
        onClick={onCloseSearch}
        className="ml-2 text-secondary-text cursor-pointer p-1 shrink-0"
      >
        <X size={20} />
      </Button>
    </div>
  );
}
