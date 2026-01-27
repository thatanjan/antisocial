"use client";

import {
  BarChart2,
  Bookmark,
  Compass,
  HelpCircle,
  LayoutGrid,
  type LucideIcon,
  Send,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "../types";

/**
 * Map of icon names to Lucide icon components.
 * This ensures type safety and avoids dynamic lookup lint errors.
 */
const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Compass,
  Bookmark,
  Send,
  BarChart2,
  Settings,
};

/**
 * Props for the NavLinkItem component.
 */
interface NavLinkItemProps {
  /** The navigation item data */
  item: NavItem;
}

/**
 * A single navigation link for the sidebar.
 * Highlights automatically when the current path matches the destination.
 */
export const NavLinkItem = ({ item }: NavLinkItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const Icon = iconMap[item.icon] || HelpCircle;

  return (
    <Link
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
      href={item.href}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
          isActive
            ? "text-primary-foreground"
            : "text-muted-foreground group-hover:text-primary",
        )}
      />
      <span className="font-medium text-sm">{item.label}</span>

      {item.badgeCount !== undefined && item.badgeCount > 0 && (
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 font-bold text-2xs",
            isActive
              ? "bg-primary-foreground text-primary"
              : "bg-primary text-primary-foreground",
          )}
        >
          {item.badgeCount}
        </span>
      )}
    </Link>
  );
};
