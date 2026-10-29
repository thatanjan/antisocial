import { ListFilter } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatFilterOption {
  label: string;
  value: string;
}

interface FilterPillsProps {
  options: ChatFilterOption[];
  value: string;
  onChange: (value: string) => void;
  onMoreFilters: () => void;
}

export const FilterPills = ({
  options,
  value,
  onChange,
  onMoreFilters,
}: FilterPillsProps) => {
  const name = useId();
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <fieldset className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              className={cn(
                "focus-within:ring-ring/50 flex h-8 shrink-0 cursor-pointer items-center rounded-full px-3.5 text-xs focus-within:ring-3",
                selected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground font-medium",
              )}
              key={option.value}
            >
              <input
                checked={selected}
                className="sr-only"
                name={name}
                onChange={() => onChange(option.value)}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          );
        })}
      </fieldset>
      <Button
        aria-label="More filters"
        className="shrink-0"
        onClick={onMoreFilters}
        size="icon"
        type="button"
        variant="ghost"
      >
        <ListFilter aria-hidden="true" />
      </Button>
    </div>
  );
};
