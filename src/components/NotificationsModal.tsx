import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Clock, CheckCircle, X } from "lucide-react";

export interface WaiterRequest {
  id: string;
  type: string;
  details?: string;
  status: "in-progress" | "done";
  timestamp: Date;
}

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: WaiterRequest[];
  onCancelRequest: (requestId: string) => void;
  onMarkDone: (requestId: string) => void;
}

export function NotificationsModal({ 
  open, 
  onOpenChange, 
  requests, 
  onCancelRequest,
  onMarkDone 
}: NotificationsModalProps) {
  const getRequestLabel = (type: string, details?: string) => {
    const labels = {
      towel: "Towel Request",
      order: "Place an Order",
      other: details || "Other Service"
    };
    return labels[type as keyof typeof labels] || "Service Request";
  };

  const formatTime = (timestamp: Date) => {
    if (!timestamp || !(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      return 'Just now';
    }
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const inProgressRequests = requests.filter(req => req.status === "in-progress");
  const doneRequests = requests.filter(req => req.status === "done");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notifications
            </p>
          ) : (
            <>
              {/* In Progress Requests */}
              {inProgressRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">In Progress</h3>
                  {inProgressRequests.map((request) => (
                    <Card key={request.id} className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {getRequestLabel(request.type, request.details)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(request.timestamp)}
                              </p>
                              <Badge 
                                variant="secondary" 
                                className="mt-2 bg-orange-100 text-orange-700 hover:bg-orange-100"
                              >
                                In Progress
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => onCancelRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Done Requests */}
              {doneRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">Completed</h3>
                  {doneRequests.map((request) => (
                    <Card key={request.id} className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {getRequestLabel(request.type, request.details)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(request.timestamp)}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className="mt-2 bg-green-100 text-green-700 hover:bg-green-100"
                            >
                              Completed
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        {(inProgressRequests.length > 0 || doneRequests.length > 0) && (
          <div className="border-t pt-4 space-y-2">
            {inProgressRequests.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  inProgressRequests.forEach(req => onMarkDone(req.id));
                }}
              >
                Mark All as Done
              </Button>
            )}
            {doneRequests.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  doneRequests.forEach(req => onCancelRequest(req.id));
                }}
              >
                Clear Completed
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}