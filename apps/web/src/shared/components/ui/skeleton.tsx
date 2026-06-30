import { cn } from "@/shared/lib/utils/core.util";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-muted-foreground/20",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
