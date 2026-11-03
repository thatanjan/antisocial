import { NotificationBell } from "@/features/notifications/components/NotificationBell";

type PageHeaderProps = {
  title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <NotificationBell />
      </div>
    </div>
  );
};

export default PageHeader;
