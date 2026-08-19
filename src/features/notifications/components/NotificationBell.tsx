"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getUnreadCount } from "@/features/notifications/actions/get-unread-count";
import { NotificationPanel } from "@/features/notifications/components/NotificationPanel";

/**
 * Bell icon with an unread-count badge, fetched once on mount. Opens the
 * notification panel on click.
 */
export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await getUnreadCount();
      if (cancelled) return;

      if (result.success) {
        setUnreadCount(result.count);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <NotificationPanel
      trigger={
        <Button
          aria-label="Notifications"
          className="relative"
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Bell />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-semibold text-primary-foreground text-xs"
              role="presentation"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </span>
        </Button>
      }
    />
  );
};
