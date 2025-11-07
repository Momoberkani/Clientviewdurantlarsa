import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { ArrowLeft, Bed, Bell, UtensilsCrossed } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { KpiCard } from "./KpiCard";
import { SunbedBookingModal } from "./SunbedBookingModal";
import { WaiterRequestModal, WaiterRequest } from "./WaiterRequestModal";
import { RestaurantMenuModal } from "./RestaurantMenuModal";
import { BookingInProgress } from "./BookingInProgress";
import { TopBar } from "./TopBar";
import { NotificationsList } from "./NotificationsList";
import { ComingSoonModal } from "./ComingSoonModal";
import { AvailableSunbedsModal } from "./AvailableSunbedsModal";

interface Sunbed {
  id: string;
  zone: string;
  status: "available" | "occupied" | "coming-soon" | "maintenance";
  description?: string;
}

interface GuestInfo {
  userName: string;
  hotelName: string;
  roomNumber: string;
}

interface SunbedPageProps {
  onBack: () => void;
  guestInfo: GuestInfo;
  onUsernameUpdate: (newUsername: string) => void;
  onProfileClick: () => void;
}

export function SunbedPage({ onBack, guestInfo, onUsernameUpdate, onProfileClick }: SunbedPageProps) {
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [currentWaiterRequestSunbedId, setCurrentWaiterRequestSunbedId] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeBookings, setActiveBookings] = useState<{
    sunbedId: string;
    duration: number;
  }[]>([]);
  const [waiterRequests, setWaiterRequests] = useState<WaiterRequest[]>([]);

  // Sunbed data - in a real app this would come from an API
  const [sunbeds] = useState<Sunbed[]>([
    // Zone A - Pool Area
    { id: "A1", zone: "Pool Area", status: "available" },
    { id: "A2", zone: "Pool Area", status: "occupied" },
    { id: "A3", zone: "Pool Area", status: "available" },
    { id: "A4", zone: "Pool Area", status: "coming-soon", description: "Available at 2:00 PM" },
    { id: "A5", zone: "Pool Area", status: "available" },
    { id: "A6", zone: "Pool Area", status: "occupied" },
    { id: "A7", zone: "Pool Area", status: "available" },
    { id: "A8", zone: "Pool Area", status: "occupied" },
    
    // Zone B - Beach Front
    { id: "B1", zone: "Beach Front", status: "available" },
    { id: "B2", zone: "Beach Front", status: "available" },
    { id: "B3", zone: "Beach Front", status: "occupied" },
    { id: "B4", zone: "Beach Front", status: "available" },
    { id: "B5", zone: "Beach Front", status: "coming-soon", description: "Available at 1:30 PM" },
    { id: "B6", zone: "Beach Front", status: "occupied" },
    { id: "B7", zone: "Beach Front", status: "available" },
    { id: "B8", zone: "Beach Front", status: "occupied" },
    
    // Zone C - Garden View
    { id: "C1", zone: "Garden View", status: "available" },
    { id: "C2", zone: "Garden View", status: "available" },
    { id: "C3", zone: "Garden View", status: "occupied" },
    { id: "C4", zone: "Garden View", status: "available" },
    { id: "C5", zone: "Garden View", status: "coming-soon", description: "Available at 3:00 PM" },
    { id: "C6", zone: "Garden View", status: "occupied" },
    { id: "C7", zone: "Garden View", status: "available" },
    { id: "C8", zone: "Garden View", status: "occupied" },
  ]);

  // Sunbed quota
  const sunbedQuota = 2;
  const usedQuota = activeBookings.length;

  // Calculate KPI data from sunbed status
  const availableSunbeds = sunbeds.filter(s => s.status === "available" && !activeBookings.some(b => b.sunbedId === s.id));
  const occupiedSunbeds = sunbeds.filter(s => s.status === "occupied" || activeBookings.some(b => b.sunbedId === s.id));
  const comingSoonSunbeds = sunbeds.filter(s => s.status === "coming-soon");

  const kpiData = [
    {
      title: "Available",
      value: availableSunbeds.length,
      status: "Available" as const,
    },
    {
      title: "Occupied",
      value: occupiedSunbeds.length,
      status: "Occupied" as const,
    },
    {
      title: "Coming Soon",
      value: comingSoonSunbeds.length,
      status: "Available soon" as const,
    },
  ];

  const handleBookingSunbed = (sunbedIds: string[], duration: number) => {
    // Add new bookings (duration is in minutes)
    const newBookings = sunbedIds.map(id => ({ sunbedId: id, duration }));
    setActiveBookings([...activeBookings, ...newBookings]);
    
    // Convert minutes to hours for display
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    const durationStr = mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
    
    // Show success toast
    toast.success(
      sunbedIds.length > 1 
        ? `${sunbedIds.length} sunbeds booked successfully` 
        : `Sunbed ${sunbedIds[0]} booked successfully`,
      {
        description: `Duration: ${durationStr}`,
        className: "bg-green-50 border-green-200",
      }
    );
    
    setIsBookingModalOpen(false);
  };

  const handleQuickBookSunbed = (sunbedId: string) => {
    // Quick book for 2 hours from available modal (duration in minutes)
    const defaultDuration = 120; // 2 hours in minutes
    const newBooking = { sunbedId, duration: defaultDuration };
    setActiveBookings([...activeBookings, newBooking]);
    
    // Show success toast
    toast.success(
      `Sunbed ${sunbedId} booked successfully`,
      {
        description: `Duration: 2 hours`,
        className: "bg-green-50 border-green-200",
      }
    );
  };

  const handleReleaseSunbed = (sunbedId: string) => {
    setActiveBookings(prev => prev.filter(booking => booking.sunbedId !== sunbedId));
    toast.success(`Sunbed ${sunbedId} released`);
  };

  const handleExtendBooking = (sunbedId: string) => {
    setActiveBookings(prev => 
      prev.map(booking => 
        booking.sunbedId === sunbedId 
          ? { ...booking, duration: booking.duration + 30 }
          : booking
      )
    );
    toast.success(`Booking extended by 30 minutes for sunbed ${sunbedId}`);
  };

  const handleWaiterRequest = (
    option: string,
    details?: string,
    sunbedId?: string
  ) => {
    // If no sunbedId is provided and there are active bookings, use the first one
    const requestSunbedId = sunbedId || (activeBookings.length > 0 ? activeBookings[0].sunbedId : undefined);
    
    // Create new waiter request
    const newRequest: WaiterRequest = {
      id: Date.now().toString(),
      type: option,
      details: details,
      status: "in-progress",
      timestamp: new Date(),
      sunbedId: requestSunbedId,
    };

    setWaiterRequests(prev => [...prev, newRequest]);

    let message = "Request sent";
    if (option === "other" && details) {
      message = `Request sent: ${details}`;
    }

    toast.success(message);
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(prev => !prev);
  };

  const handleCancelRequest = (requestId: string) => {
    setWaiterRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled" as const }
          : req
      )
    );
    toast.success("Request cancelled");
  };

  const handleMarkRequestDone = (requestId: string) => {
    setWaiterRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "done" as const }
          : req
      )
    );
    toast.success("Request marked as done");
  };

  const handleRemoveRequest = (requestId: string) => {
    setWaiterRequests(prev => prev.filter(req => req.id !== requestId));
  };

  // Auto-complete requests after 30 seconds (demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setWaiterRequests(prev => {
        const now = new Date();
        return prev.map(req => {
          const timeDiff = now.getTime() - req.timestamp.getTime();
          // Auto-complete requests older than 30 seconds
          if (req.status === "in-progress" && timeDiff > 30000) {
            toast.success(`${req.type === "other" ? req.details || "Service request" : req.type} completed by staff`);
            return { ...req, status: "done" as const };
          }
          return req;
        });
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate notification count (only in-progress requests)
  const notificationCount = waiterRequests.filter(req => req.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar 
        notificationCount={notificationCount}
        onNotificationClick={handleNotificationClick}
        isNotificationsOpen={isNotificationsOpen}
        onProfileClick={onProfileClick}
        userName={guestInfo.userName}
        roomNumber={guestInfo.roomNumber}
      />

      {/* Notifications List */}
      {isNotificationsOpen && (
        <div className="border-b border-border bg-card">
          <div className="p-4 sm:p-6 pb-4">
            <div className="max-w-md mx-auto">
              <NotificationsList
                requests={waiterRequests}
                onCancelRequest={handleCancelRequest}
                onRemoveRequest={handleRemoveRequest}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-6 sm:space-y-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Title and Instructions */}
          <div className="space-y-2">
            <h1>Book your sunbed</h1>
            <p className="text-sm text-muted-foreground">
              Check the availability status below, then select your preferred sunbed from the available options. You can book up to {sunbedQuota} sunbeds at once.
            </p>
          </div>

          {/* Global KPI Section - Sunbed Statuses */}
          <div className="space-y-4">
            <h2>Sunbed Status</h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {kpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  status={kpi.status}
                  onClick={
                    kpi.status === "Available soon" ? () => setIsComingSoonModalOpen(true) :
                    kpi.status === "Available" ? () => setIsAvailableModalOpen(true) :
                    undefined
                  }
                />
              ))}
            </div>
          </div>

        {/* Sunbed Booking in Progress Section */}
        {activeBookings.map((booking) => (
          <BookingInProgress
            key={booking.sunbedId}
            sunbedId={booking.sunbedId}
            totalTime={booking.duration}
            onRelease={() => handleReleaseSunbed(booking.sunbedId)}
            onExtend={() => handleExtendBooking(booking.sunbedId)}
            onCallWaiter={() => {
              setCurrentWaiterRequestSunbedId(booking.sunbedId);
              setIsWaiterModalOpen(true);
            }}
            showWaiterButton={activeBookings.length > 1}
          />
        ))}

        {/* Action Buttons Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Book a Sunbed Card */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              usedQuota >= sunbedQuota 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:border-violet-300'
            }`}
            onClick={usedQuota >= sunbedQuota ? undefined : () => setIsBookingModalOpen(true)}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  usedQuota >= sunbedQuota 
                    ? 'bg-gray-200' 
                    : 'bg-violet-100'
                }`}>
                  <Bed className={`w-6 h-6 ${
                    usedQuota >= sunbedQuota 
                      ? 'text-gray-500' 
                      : 'text-violet-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3>
                      {usedQuota >= sunbedQuota ? "Quota Reached" : "Book a Sunbed"}
                    </h3>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-xs text-muted-foreground">Your Quota</p>
                      <p className="text-sm">
                        <span className="font-bold">{usedQuota}</span>
                        <span className="text-muted-foreground"> / {sunbedQuota}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pr-16">
                    {usedQuota >= sunbedQuota 
                      ? "You've reached your maximum sunbed quota" 
                      : `Select from available sunbeds across all zones. ${sunbedQuota - usedQuota} ${sunbedQuota - usedQuota > 1 ? 'spots' : 'spot'} remaining`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Food & Drinks Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-md hover:border-amber-300"
            onClick={() => setIsMenuModalOpen(true)}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-100">
                  <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Order Food & Drinks</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our menu and place orders directly to your sunbed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call a Waiter Card - Show when there are 0 or 1 bookings */}
          {activeBookings.length <= 1 && (
            <Card 
              className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
              onClick={() => {
                setCurrentWaiterRequestSunbedId(activeBookings.length > 0 ? activeBookings[0].sunbedId : undefined);
                setIsWaiterModalOpen(true);
              }}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">Call a Waiter</h3>
                    <p className="text-sm text-muted-foreground">
                      Request towels or ask for assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sunbed Booking Modal */}
        <SunbedBookingModal
          open={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
          onConfirm={handleBookingSunbed}
          availableSunbeds={availableSunbeds}
          remainingQuota={sunbedQuota - usedQuota}
        />

        {/* Waiter Request Modal */}
        <WaiterRequestModal
          open={isWaiterModalOpen}
          onOpenChange={(open) => {
            setIsWaiterModalOpen(open);
            if (!open) {
              setCurrentWaiterRequestSunbedId(undefined);
            }
          }}
          onConfirm={handleWaiterRequest}
          sunbedId={currentWaiterRequestSunbedId}
        />

        {/* Restaurant Menu Modal */}
        <RestaurantMenuModal
          open={isMenuModalOpen}
          onOpenChange={setIsMenuModalOpen}
          onOrderPlaced={(orderItems, total, paymentMethod, sunbedId) => {
            const itemNames = orderItems.map(item => `${item.name} (x${item.quantity})`).join(", ");
            const paymentText = paymentMethod === "room" ? "charged to room" : 
                              paymentMethod === "card" ? "paid by card" : "paid with cash";
            const sunbedText = sunbedId ? ` for Sunbed ${sunbedId}` : "";
            toast.success(`Order placed: ${itemNames} - €${total.toFixed(2)} ${paymentText}${sunbedText}`);
          }}
        />

        {/* Coming Soon Modal */}
        <ComingSoonModal
          open={isComingSoonModalOpen}
          onOpenChange={setIsComingSoonModalOpen}
          comingSoonSunbeds={comingSoonSunbeds}
        />

        {/* Available Sunbeds Modal */}
        <AvailableSunbedsModal
          open={isAvailableModalOpen}
          onOpenChange={setIsAvailableModalOpen}
          availableSunbeds={availableSunbeds}
          onBookSunbed={handleQuickBookSunbed}
          usedQuota={usedQuota}
          sunbedQuota={sunbedQuota}
        />
        </div>
      </div>
    </div>
  );
}