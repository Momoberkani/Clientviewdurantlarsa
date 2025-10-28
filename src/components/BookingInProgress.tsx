import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface BookingInProgressProps {
  sunbedId: string;
  totalTime: number; // in minutes
  onRelease: () => void;
  onExtend: () => void;
  onCallWaiter?: () => void;
  showWaiterButton?: boolean;
}

export function BookingInProgress({ sunbedId, totalTime, onRelease, onExtend, onCallWaiter, showWaiterButton = false }: BookingInProgressProps) {
  const [timeLeft, setTimeLeft] = useState(totalTime * 60); // convert to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Check if we're in the last 5 minutes (300 seconds)
  const isLastFiveMinutes = timeLeft <= 300;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4">Sunbed Booking in Progress</h3>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sunbed {sunbedId}</p>
            <div className="text-2xl mt-2">{formatTime(timeLeft)}</div>
            <p className="text-sm text-muted-foreground">remaining</p>
          </div>
          <div className="space-y-3">
            {showWaiterButton && onCallWaiter && (
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 cursor-pointer"
                onClick={onCallWaiter}
              >
                Call a Waiter
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button 
                variant="destructive" 
                size="lg" 
                className="flex-1 cursor-pointer"
                onClick={onRelease}
              >
                Release my sunbed
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 cursor-pointer"
                onClick={onExtend}
                disabled={!isLastFiveMinutes}
              >
                Extend my booking
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}