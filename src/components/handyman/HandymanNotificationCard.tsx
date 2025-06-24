
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CircleCheck,
  Mail,
  Settings,
  BellDot,
  AlertCircle,
} from "lucide-react";

interface NotificationAction {
  label: string;
  variant?: "default" | "outline" | "secondary";
}

export type NotificationType =
  | "job"
  | "payment"
  | "review"
  | "system"
  | "subscription";

interface HandymanNotificationCardProps {
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  actions?: NotificationAction[];
}

const iconMap: Record<NotificationType, React.ReactNode> = {
  job: (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
      <Calendar className="text-blue-500" />
    </span>
  ),
  payment: (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
      <CircleCheck className="text-green-500" />
    </span>
  ),
  review: (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
      <Mail className="text-yellow-500" />
    </span>
  ),
  system: (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
      <Settings className="text-purple-500" />
    </span>
  ),
  subscription: (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
      <AlertCircle className="text-red-500" />
    </span>
  ),
};

const HandymanNotificationCard: React.FC<HandymanNotificationCardProps> = ({
  type,
  title,
  description,
  time,
  unread,
  actions,
}) => (
  <div className="flex items-start gap-4 rounded-xl border bg-white px-6 py-5 mb-4 shadow-sm">
    {iconMap[type]}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base text-gray-900">{title}</span>
        {unread && (
          <BellDot className="w-4 h-4 text-blue-500 ml-2" strokeWidth={3} />
        )}
      </div>
      <p className="text-gray-700 text-sm mt-1 mb-4">{description}</p>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, i) => (
            <Button
              key={action.label}
              variant={
                action.variant ??
                (i === 0 ? "default" : "outline")
              }
              className={
                i === 0
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "border-green-500 text-green-500 hover:bg-green-50"
              }
              size="sm"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
    <div className="flex flex-col items-end min-w-fit">
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
      {unread && (
        <span className="mt-2 w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
      )}
    </div>
  </div>
);

export default HandymanNotificationCard;
