import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useIsMobile } from "./ui/use-mobile";
import { MapPin, Clock } from "lucide-react";

interface Sunbed {
  id: string;
  zone: string;
  status: "available" | "occupied" | "coming-soon" | "maintenance";
  description?: string;
}

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comingSoonSunbeds: Sunbed[];
}

export function ComingSoonModal({ open, onOpenChange, comingSoonSunbeds }: ComingSoonModalProps) {
  const isMobile = useIsMobile();

  // Group sunbeds by zone for better organization
  const sunbedsByZone = comingSoonSunbeds.reduce((acc, sunbed) => {
    if (!acc[sunbed.zone]) {
      acc[sunbed.zone] = [];
    }
    acc[sunbed.zone].push(sunbed);
    return acc;
  }, {} as Record<string, Sunbed[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[85vh]" : "sm:max-w-lg h-[80vh]"} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Coming Soon</DialogTitle>
          <DialogDescription>
            {comingSoonSunbeds.length === 0 
              ? "No sunbeds are scheduled to become available soon."
              : `${comingSoonSunbeds.length} sunbeds will be available soon. Check back at the specified times.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
          {comingSoonSunbeds.length === 0 ? (
            <div className={`text-center ${isMobile ? "py-8" : "py-6"}`}>
              <div className="bg-muted/30 rounded-lg p-6 space-y-2">
                <Clock className={`mx-auto ${isMobile ? "h-12 w-12" : "h-10 w-10"} text-muted-foreground mb-4`} />
                <h3 className={`${isMobile ? "text-base" : "text-sm"} font-medium text-muted-foreground`}>
                  No Upcoming Availability
                </h3>
                <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                  All sunbeds are currently available or occupied with no scheduled releases.
                </p>
                <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                  Check back later or contact staff for assistance.
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
                  <Card key={sunbed.id} className="transition-colors">
                    <CardContent className={`${isMobile ? "p-4" : "p-3"}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className={`${isMobile ? "h-4 w-4" : "h-3 w-3"} text-muted-foreground`} />
                            <span className={`font-medium ${isMobile ? "text-base" : ""}`}>
                              Sunbed {sunbed.id}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {zone.split(' ')[0]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Coming Soon
                            </Badge>
                          </div>
                          <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground mb-1`}>
                            Located in the {sunbed.zone} with access to nearby amenities.
                          </p>
                          {sunbed.description && (
                            <div className="flex items-center gap-1">
                              <Clock className={`${isMobile ? "h-4 w-4" : "h-3 w-3"} text-orange-600`} />
                              <p className={`${isMobile ? "text-sm" : "text-xs"} text-orange-600 font-medium`}>
                                {sunbed.description}
                              </p>
                            </div>
                          )}
                        </div>
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