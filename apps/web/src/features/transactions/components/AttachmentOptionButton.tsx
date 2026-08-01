import { Button } from "@/shared/components/animate-ui/components/buttons/button";

interface AttachmentOptionButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AttachmentOptionButton({
  label,
  onClick,
}: Readonly<AttachmentOptionButtonProps>) {
  return (
    <Button
      variant="unstyled"
      type="button"
      className="w-full cursor-pointer rounded-lg border border-border bg-surface py-2.5 text-center text-sm font-medium transition-colors hover:border-primary hover:text-primary"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
