import { Card, CardContent } from "./ui/card";

interface WelcomeSectionProps {
  userName: string;
  hotelName: string;
  roomNumber: string;
  sunbedQuota: number;
  usedQuota: number;
}

export function WelcomeSection({ userName, hotelName, roomNumber, sunbedQuota, usedQuota }: WelcomeSectionProps) {
  const remainingQuota = sunbedQuota - usedQuota;
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-medium text-blue-900">Welcome to {hotelName}, {userName}!</h2>
            <p className="text-blue-700">Room {roomNumber}</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">Sunbed Quota:</span>
              <span className="font-medium text-blue-900">
                {remainingQuota} of {sunbedQuota} remaining
              </span>
            </div>
            
            {remainingQuota === 0 && (
              <span className="text-orange-600 font-medium">Quota reached</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}