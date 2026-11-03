import { cn } from "@/lib/utils";

interface DateSeparatorProps {
  label: string;
  className?: string;
}

export const DateSeparator = ({ label, className }: DateSeparatorProps) => (
  <div className={cn("flex items-center justify-center", className)}>
    <span className="bg-foreground text-background text-2xs rounded-full px-3.5 py-1 font-mono font-semibold tracking-wider uppercase shadow-sm">
      {label}
    </span>
  </div>
);
