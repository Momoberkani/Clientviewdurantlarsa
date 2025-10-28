import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useIsMobile } from "./ui/use-mobile";
import { MapPin, Search, X, Filter, Check } from "lucide-react";

interface Sunbed {
  id: string;
  zone: string;
  status: "available" | "occupied" | "coming-soon" | "maintenance";
  description?: string;
}

interface SunbedBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sunbedIds: string[]) => void;
  availableSunbeds: Sunbed[];
  remainingQuota: number;
}

export function SunbedBookingModal({ open, onOpenChange, onConfirm, availableSunbeds, remainingQuota }: SunbedBookingModalProps) {
  const [selectedSunbedIds, setSelectedSunbedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const isMultiSelect = remainingQuota > 1;

  // Get unique zones from available sunbeds
  const availableZones = Array.from(new Set(availableSunbeds.map(s => s.zone)));

  const handleConfirm = () => {
    if (selectedSunbedIds.length > 0) {
      onConfirm(selectedSunbedIds);
      onOpenChange(false);
      setSelectedSunbedIds([]);
      setSearchQuery("");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSelectedSunbedIds([]);
      setSearchQuery("");
      setSelectedZones([]);
    }
  };

  const handleSunbedToggle = (sunbedId: string, checked: boolean) => {
    if (isMultiSelect) {
      if (checked) {
        if (selectedSunbedIds.length < remainingQuota) {
          setSelectedSunbedIds(prev => [...prev, sunbedId]);
        }
      } else {
        setSelectedSunbedIds(prev => prev.filter(id => id !== sunbedId));
      }
    } else {
      setSelectedSunbedIds(checked ? [sunbedId] : []);
    }
  };

  const handleRemoveSelected = (sunbedId: string) => {
    setSelectedSunbedIds(prev => prev.filter(id => id !== sunbedId));
  };

  const handleZoneToggle = (zone: string) => {
    setSelectedZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    );
  };

  const handleClearAll = () => {
    setSelectedSunbedIds([]);
  };

  // Filter sunbeds based on search query and selected zones
  const filteredSunbeds = useMemo(() => {
    let filtered = availableSunbeds;
    
    // Filter by zones if any are selected
    if (selectedZones.length > 0) {
      filtered = filtered.filter(sunbed => selectedZones.includes(sunbed.zone));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sunbed => 
        sunbed.id.toLowerCase().includes(query) ||
        sunbed.zone.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [availableSunbeds, searchQuery, selectedZones]);

  // Group filtered sunbeds by zone for better organization
  const sunbedsByZone = filteredSunbeds.reduce((acc, sunbed) => {
    if (!acc[sunbed.zone]) {
      acc[sunbed.zone] = [];
    }
    acc[sunbed.zone].push(sunbed);
    return acc;
  }, {} as Record<string, Sunbed[]>);

  const selectedSunbeds = availableSunbeds.filter(s => selectedSunbedIds.includes(s.id));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[90vh]" : "sm:max-w-lg h-[85vh]"} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Book a Sunbed</DialogTitle>
          <DialogDescription>
            {isMultiSelect 
              ? `Select up to ${remainingQuota} sunbeds from ${availableSunbeds.length} available options.`
              : `Choose from ${availableSunbeds.length} available sunbeds.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search and Filter Row */}
          <div className="flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sunbed-search">Search & Filter</Label>
              <div className="flex items-center gap-2">
                {(searchQuery || selectedZones.length > 0) && (
                  <Badge variant="secondary" className="text-xs">
                    {filteredSunbeds.length} result{filteredSunbeds.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isMobile ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
                <Input
                  id="sunbed-search"
                  placeholder="Search by ID (e.g., A1)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${isMobile ? "text-base h-12" : ""} touch-manipulation`}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isMobile ? "h-8 w-8" : "h-6 w-6"} p-0`}
                    onClick={() => setSearchQuery("")}
                  >
                    <X className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                  </Button>
                )}
              </div>
              
              {/* Zone Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`${isMobile ? "h-12 px-4" : "px-3"} touch-manipulation flex items-center gap-2`}
                  >
                    <Filter className={`${isMobile ? "h-5 w-5" : "h-4 w-4"}`} />
                    {selectedZones.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {selectedZones.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter by Zone</h4>
                    {availableZones.map((zone) => (
                      <div key={zone} className="flex items-center space-x-2">
                        <Checkbox
                          id={`zone-${zone}`}
                          checked={selectedZones.includes(zone)}
                          onCheckedChange={() => handleZoneToggle(zone)}
                          className="touch-manipulation"
                        />
                        <Label 
                          htmlFor={`zone-${zone}`} 
                          className="text-sm cursor-pointer flex-1"
                        >
                          {zone}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {availableSunbeds.filter(s => s.zone === zone).length}
                        </Badge>
                      </div>
                    ))}
                    {selectedZones.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedZones([])}
                        className="w-full text-xs"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Selected Sunbeds Summary */}
          {selectedSunbedIds.length > 0 && (
            <div className="flex-shrink-0 bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}>
                  Selected ({selectedSunbedIds.length}/{remainingQuota})
                </span>
                {isMultiSelect && selectedSunbedIds.length < remainingQuota && (
                  <Badge variant="secondary" className="text-xs">
                    {remainingQuota - selectedSunbedIds.length} more available
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSunbeds.map((sunbed) => (
                  <Badge
                    key={sunbed.id}
                    variant="outline"
                    className="flex items-center gap-1 pr-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {sunbed.id}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSelected(sunbed.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              {selectedSunbedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full touch-manipulation"
                >
                  Clear All
                </Button>
              )}
            </div>
          )}

          {/* Sunbed List - Properly Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
            {availableSunbeds.length === 0 ? (
              <div className={`text-center ${isMobile ? "py-6" : "py-4"}`}>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <p className={`${isMobile ? "text-base" : "text-sm"} text-muted-foreground`}>
                    No sunbeds are currently available. Please check back later or contact staff for assistance.
                  </p>
                  <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                    You can check the "Coming Soon" section for sunbeds that will be available later.
                  </p>
                </div>
              </div>
            ) : filteredSunbeds.length === 0 ? (
              <div className={`text-center ${isMobile ? "py-6" : "py-4"}`}>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <p className={`${isMobile ? "text-base" : "text-sm"} text-muted-foreground`}>
                    No sunbeds match your current filters.
                  </p>
                  <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                    Try adjusting your search or zone filters.
                  </p>
                </div>
              </div>
            ) : (
              Object.entries(sunbedsByZone).map(([zone, sunbeds]) => (
                <div key={zone} className="space-y-2">
                  <div className={`sticky top-0 bg-background px-2 py-1 ${isMobile ? "text-sm" : "text-xs"} font-medium text-muted-foreground border-b z-10`}>
                    {zone} ({sunbeds.length})
                  </div>
                  {sunbeds.map((sunbed) => {
                    const isSelected = selectedSunbedIds.includes(sunbed.id);
                    const isDisabled = !isSelected && selectedSunbedIds.length >= remainingQuota;
                    
                    return (
                      <Card 
                        key={sunbed.id} 
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "ring-2 ring-primary bg-accent" : ""
                        } ${isDisabled ? "opacity-50" : "hover:bg-accent"}`}
                      >
                        <CardContent className={`${isMobile ? "p-4" : "p-3"}`}>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSunbedToggle(sunbed.id, !!checked)}
                              disabled={isDisabled}
                              className={`${isMobile ? "h-5 w-5" : ""} touch-manipulation`}
                            />
                            
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => !isDisabled && handleSunbedToggle(sunbed.id, !isSelected)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className={`${isMobile ? "h-4 w-4" : "h-3 w-3"} text-muted-foreground`} />
                                <span className={`font-medium ${isMobile ? "text-base" : ""}`}>
                                  Sunbed {sunbed.id}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {zone.split(' ')[0]}
                                </Badge>
                              </div>
                              <p className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>
                                Located in the {sunbed.zone} with access to nearby amenities.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
        
        <Separator className="flex-shrink-0" />
        
        <div className="flex-shrink-0">
          <Button 
            onClick={handleConfirm} 
            disabled={selectedSunbedIds.length === 0 || availableSunbeds.length === 0}
            className="w-full cursor-pointer touch-manipulation"
          >
            {availableSunbeds.length === 0 
              ? "No Sunbeds Available" 
              : selectedSunbedIds.length === 0
                ? `Select ${isMultiSelect ? "up to " + remainingQuota + " sunbeds" : "a sunbed"} to Continue`
                : isMultiSelect && selectedSunbedIds.length > 1
                  ? `Book ${selectedSunbedIds.length} Sunbeds (${selectedSunbedIds.join(", ")})`
                  : `Book Sunbed ${selectedSunbedIds[0]}`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}