import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useIsMobile } from "./ui/use-mobile";
import { MapPin, CheckCircle } from "lucide-react";

interface Sunbed {
  id: string;
  zone: string;
  status: "available" | "occupied" | "coming-soon" | "maintenance";
  description?: string;
}

interface AvailableSunbedsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSunbeds: Sunbed[];
  onBookSunbed: (sunbedId: string) => void;
  usedQuota: number;
  sunbedQuota: number;
}

export function AvailableSunbedsModal({ 
  open, 
  onOpenChange, 
  availableSunbeds,
  onBookSunbed,
  usedQuota,
  sunbedQuota
}: AvailableSunbedsModalProps) {
  const isMobile = useIsMobile();
  const hasQuotaRemaining = usedQuota < sunbedQuota;

  // Group sunbeds by zone for better organization
  const sunbedsByZone = availableSunbeds.reduce((acc, sunbed) => {
    if (!acc[sunbed.zone]) {
      acc[sunbed.zone] = [];
    }
    acc[sunbed.zone].push(sunbed);
    return acc;
  }, {} as Record<string, Sunbed[]>);

  const handleBookClick = (sunbedId: string) => {
    onBookSunbed(sunbedId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[85vh]" : "sm:max-w-lg h-[80vh]"} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Available Sunbeds</DialogTitle>
          <DialogDescription>
            {availableSunbeds.length === 0 
              ? "No sunbeds are currently available."
              : hasQuotaRemaining 
                ? `${availableSunbeds.length} sunbeds available. You have ${sunbedQuota - usedQuota} ${sunbedQuota - usedQuota > 1 ? 'spots' : 'spot'} remaining.`
                : `${availableSunbeds.length} sunbeds available, but you've reached your quota (${usedQuota}/${sunbedQuota}).`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
          {availableSunbeds.length === 0 ? (
            <div className={`text-center ${isMobile ? "py-8" : "py-6"}`}>
              <div className="bg-muted/30 rounded-lg p-6 space-y-2">
                <CheckCircle className={`mx-auto ${isMobile ? "h-12 w-12" : "h-10 w-10"} text-muted-foreground mb-4`} />
                <h3 className={`${isMobile ? "text-base" : "text-sm"} font-medium text-muted-foreground`}>
                  No Available Sunbeds
                </h3>
                <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                  All sunbeds are currently occupied or reserved.
                </p>
                <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                  Check "Coming Soon" for sunbeds that will be available shortly.
                </p>
              </div>
            </div>
          ) : (
            Object.entries(sunbedsByZone).map(([zone, sunbeds]) => (
              <div key={zone} className="space-y-2">
                <div className={`sticky top-0 bg-background px-2 py-1 ${isMobile ? "text-sm" : "text-xs"} font-medium text-muted-foreground border-b z-10`}>
                  {zone} ({sunbeds.length})
                </div>
                {sunbeds.map((sunbed) => (
                  <Card key={sunbed.id} className="transition-colors border-green-200 bg-green-50/30">
                    <CardContent className={`${isMobile ? "p-4" : "p-3"}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className={`${isMobile ? "h-4 w-4" : "h-3 w-3"} text-muted-foreground`} />
                            <span className={`font-medium ${isMobile ? "text-base" : ""}`}>
                              Sunbed {sunbed.id}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {zone.split(' ')[0]}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          </div>
                          <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground mb-2`}>
                            Located in the {sunbed.zone} with access to nearby amenities.
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleBookClick(sunbed.id)}
                          disabled={!hasQuotaRemaining}
                          className="flex-shrink-0"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}