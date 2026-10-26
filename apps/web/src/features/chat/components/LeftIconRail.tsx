import type { LucideIcon } from "lucide-react";
import { MessageCircle, Moon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
}

interface LeftIconRailProps {
  brandHref: string;
  items: ChatNavigationItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function LeftIconRail({
  brandHref,
  items,
  profileHref,
  avatarUrl,
  displayName,
  isDarkMode,
  onToggleTheme,
}: LeftIconRailProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="border-border bg-background hidden h-full w-16 shrink-0 flex-col items-center justify-between border-r py-4 md:flex md:w-18"
      data-purpose="navigation-rail"
    >
      <div className="flex flex-col items-center gap-6">
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          size="icon"
          variant="ghost"
        >
          <Link aria-label="Antisocial home" href={brandHref}>
            <MessageCircle aria-hidden="true" />
          </Link>
        </Button>
        <div className="flex flex-col items-center gap-2">
          {items.map(({ label, href, icon: Icon, active }) => (
            <Button
              asChild
              className={cn(
                active
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
              key={label}
              size="icon"
              variant="ghost"
            >
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={label}
                href={href}
              >
                <Icon aria-hidden="true" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          aria-label="Toggle dark mode"
          aria-pressed={isDarkMode}
          onClick={onToggleTheme}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Moon aria-hidden="true" />
        </Button>
        <Link aria-label={`${displayName} profile`} href={profileHref}>
          <Avatar className="size-10">
            <AvatarImage alt="" src={avatarUrl} />
            <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
