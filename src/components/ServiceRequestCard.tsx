import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface ServiceRequest {
  id: number;
  description: string;
  details?: string;
  timestamp: Date;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  estimatedTime?: string;
  queuePosition?: number;
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onCancel: (id: number) => void;
  formatTime: (date: Date) => string;
  getStatusColor: (status: string) => string;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: number) => void;
}

export function ServiceRequestCard({
  request,
  onCancel,
  formatTime,
  getStatusColor,
  showCheckbox = false,
  isSelected = false,
  onToggleSelection
}: ServiceRequestCardProps) {
  return (
    <div className="flex items-start gap-2 p-2 bg-background rounded border">
      {showCheckbox && onToggleSelection && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(request.id)}
          className="mt-1"
        />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-sm font-medium">{request.description}</p>
              {request.status === "pending" && request.queuePosition && (
                <Badge variant="outline" className="text-xs">#{request.queuePosition} in queue</Badge>
              )}
            </div>
            {request.details && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{request.details}</p>}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-xs text-muted-foreground">{formatTime(request.timestamp)}</p>
              {request.status === "pending" && request.estimatedTime && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-blue-600 font-medium">Est: {request.estimatedTime}</p>
                </>
              )}
              {request.status === "in-progress" && request.estimatedTime && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-blue-600 font-medium">Arriving in {request.estimatedTime}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
            {request.status === "pending" && !showCheckbox && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(request.id);
                }}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
