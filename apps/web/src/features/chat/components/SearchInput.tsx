import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search or start a new chat",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)} data-purpose="search-bar">
      <Input
        aria-label={placeholder}
        className="bg-muted focus-visible:border-ring focus-visible:ring-ring/50 h-10 rounded-xl pr-10"
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      <Search
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
      />
    </div>
  );
}
