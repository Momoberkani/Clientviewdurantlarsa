import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export interface WaiterRequest {
  id: string;
  type: string;
  details?: string;
  status: "in-progress" | "done" | "cancelled";
  timestamp: Date;
  sunbedId?: string;
}

interface NotificationsListProps {
  requests: WaiterRequest[];
  onCancelRequest: (requestId: string) => void;
  onRemoveRequest: (requestId: string) => void;
}

export function NotificationsList({ 
  requests, 
  onCancelRequest,
  onRemoveRequest
}: NotificationsListProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "done" | "cancelled">("all");

  const getRequestLabel = (type: string, details?: string) => {
    const labels = {
      towel: "Towel Request",
      order: "Food & Drinks Order",
      other: details || "Other Service"
    };
    return labels[type as keyof typeof labels] || "Service Request";
  };

  const formatOrderDetails = (details?: string) => {
    if (!details) return null;
    
    // Check if it's an order with our formatted structure
    if (details.includes(" | Total: €")) {
      const parts = details.split(" | ");
      const items = parts[0];
      
      // Extract total and payment method if available
      let total = "";
      let paymentMethod = "";
      
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part.startsWith("Total: €")) {
          total = part;
        } else if (part.startsWith("Payment: ")) {
          paymentMethod = part.replace("Payment: ", "");
        }
      }
      
      return {
        items: items,
        total: total,
        paymentMethod: paymentMethod
      };
    }
    
    return null;
  };

  const formatTime = (timestamp: Date) => {
    if (!timestamp || !(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      return 'Just now';
    }
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRequestDetails = (request: WaiterRequest) => {
    return (
      <div className="flex-1">
        <p className="font-medium text-sm">
          {getRequestLabel(request.type, request.details)}
        </p>
        {request.type === "order" && request.details && (
          <div className="mt-2 text-xs">
            {(() => {
              const orderInfo = formatOrderDetails(request.details);
              if (orderInfo) {
                return (
                  <div className="bg-white rounded p-2 border">
                    <p className="text-muted-foreground mb-1">{orderInfo.items}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-primary">{orderInfo.total}</p>
                      {orderInfo.paymentMethod && (
                        <Badge variant="outline" className="text-xs">
                          {orderInfo.paymentMethod}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              }
              return <p className="text-muted-foreground">{request.details}</p>;
            })()}
          </div>
        )}
        {request.sunbedId && (
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Sunbed {request.sunbedId}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatTime(request.timestamp)}
        </p>
      </div>
    );
  };

  // Filter requests based on active filter
  const filteredRequests = activeFilter === "all" ? requests : requests.filter(req => req.status === activeFilter);

  const inProgressRequests = filteredRequests.filter(req => req.status === "in-progress");
  const doneRequests = filteredRequests.filter(req => req.status === "done");
  const cancelledRequests = filteredRequests.filter(req => req.status === "cancelled");

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No notifications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
          className="h-8"
        >
          All ({requests.length})
        </Button>
        <Button
          variant={activeFilter === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("in-progress")}
          className="h-8"
        >
          In Progress ({requests.filter(req => req.status === "in-progress").length})
        </Button>
        <Button
          variant={activeFilter === "done" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("done")}
          className="h-8"
        >
          Completed ({requests.filter(req => req.status === "done").length})
        </Button>
        <Button
          variant={activeFilter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("cancelled")}
          className="h-8"
        >
          Cancelled ({requests.filter(req => req.status === "cancelled").length})
        </Button>
      </div>

      {/* Show message when no results for current filter */}
      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No {activeFilter === "all" ? "" : activeFilter} notifications
            </p>
          </CardContent>
        </Card>
      )}
      {/* In Progress Requests */}
      {inProgressRequests.length > 0 && (activeFilter === "all" || activeFilter === "in-progress") && (
        <div className="space-y-3">
          {activeFilter === "all" && <h3 className="font-medium text-sm text-muted-foreground">In Progress</h3>}
          {inProgressRequests.map((request) => (
            <Card key={request.id} className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                  {renderRequestDetails(request)}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-700 hover:bg-orange-100"
                  >
                    In Progress
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onCancelRequest(request.id)}
                  >
                    Cancel my request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Done Requests */}
      {doneRequests.length > 0 && (activeFilter === "all" || activeFilter === "done") && (
        <div className="space-y-3">
          {activeFilter === "all" && <h3 className="font-medium text-sm text-muted-foreground">Completed</h3>}
          {doneRequests.map((request) => (
            <Card key={request.id} className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  {renderRequestDetails(request)}
                </div>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-green-100 text-green-700 hover:bg-green-100"
                >
                  Completed
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancelled Requests */}
      {cancelledRequests.length > 0 && (activeFilter === "all" || activeFilter === "cancelled") && (
        <div className="space-y-3">
          {activeFilter === "all" && <h3 className="font-medium text-sm text-muted-foreground">Cancelled</h3>}
          {cancelledRequests.map((request) => (
            <Card key={request.id} className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-700">
                      {getRequestLabel(request.type, request.details)}
                    </p>
                    {request.type === "order" && request.details && (
                      <div className="mt-2 text-xs">
                        {(() => {
                          const orderInfo = formatOrderDetails(request.details);
                          if (orderInfo) {
                            return (
                              <div className="bg-white rounded p-2 border">
                                <p className="text-muted-foreground mb-1">{orderInfo.items}</p>
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-gray-600">{orderInfo.total}</p>
                                  {orderInfo.paymentMethod && (
                                    <Badge variant="outline" className="text-xs">
                                      {orderInfo.paymentMethod}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return <p className="text-muted-foreground">{request.details}</p>;
                        })()}
                      </div>
                    )}
                    {request.sunbedId && (
                      <p className="text-xs text-muted-foreground font-medium mt-1">
                        Sunbed {request.sunbedId}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTime(request.timestamp)}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-gray-100 text-gray-700 hover:bg-gray-100"
                >
                  Cancelled
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clear Completed and Cancelled */}
      {(doneRequests.length > 0 || cancelledRequests.length > 0) && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => {
              [...doneRequests, ...cancelledRequests].forEach(req => onRemoveRequest(req.id));
            }}
          >
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
}