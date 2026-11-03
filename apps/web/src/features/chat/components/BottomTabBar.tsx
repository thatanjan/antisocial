import { Contact, Home, type LucideIcon, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Nav icon names accepted from server components (components can't cross the server/client boundary). */
export type NavIconName = "home" | "contact" | "users";

export const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  home: Home,
  contact: Contact,
  users: Users,
};

export interface BottomTabItem {
  label: string;
  href: string;
  icon: NavIconName;
  active: boolean;
}

interface BottomTabBarProps {
  items: BottomTabItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
}

export const BottomTabBar = ({
  items,
  profileHref,
  avatarUrl,
  displayName,
}: BottomTabBarProps) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-10 flex items-center justify-around border-t px-2 pt-2 pb-2 backdrop-blur md:hidden"
    >
      {items.map(({ label, href, icon, active }) => {
        const Icon = NAV_ICONS[icon];
        return (
          <Button
            asChild
            className={cn(
              "text-muted-foreground h-auto min-w-12 flex-col gap-1 px-2 py-1",
              active && "text-primary font-semibold",
            )}
            key={label}
            variant="ghost"
          >
            <Link aria-current={active ? "page" : undefined} href={href}>
              <Icon aria-hidden="true" className="size-5" />
              <span className="text-xs">{label}</span>
            </Link>
          </Button>
        );
      })}
      <Link
        aria-label={`${displayName} profile`}
        className="text-muted-foreground focus-visible:ring-ring/50 flex min-w-12 flex-col items-center gap-1 rounded-md p-1 outline-none focus-visible:ring-3"
        href={profileHref}
      >
        <Avatar className="size-5">
          <AvatarImage alt="" src={avatarUrl} />
          <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span className="text-xs">Me</span>
      </Link>
    </nav>
  );
};
