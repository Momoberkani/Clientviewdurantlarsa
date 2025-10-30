import { Bell, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TopBarProps {
  notificationCount: number;
  onNotificationClick: () => void;
  isNotificationsOpen: boolean;
  onProfileClick: () => void;
  userName?: string;
  roomNumber?: string;
}

export function TopBar({ notificationCount, onNotificationClick, isNotificationsOpen, onProfileClick, userName, roomNumber }: TopBarProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-medium">Hotel Reservation</h1>
          {userName && roomNumber && (
            <p className="text-sm text-muted-foreground">{userName} - Room {roomNumber}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 cursor-pointer"
          onClick={onProfileClick}
        >
          <User className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={`relative p-2 cursor-pointer ${isNotificationsOpen ? 'bg-accent' : ''}`}
            onClick={onNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}