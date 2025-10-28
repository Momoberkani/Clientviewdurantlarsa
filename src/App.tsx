import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { WelcomeSection } from "./components/WelcomeSection";
import { KpiCard } from "./components/KpiCard";
import { WaiterRequestModal } from "./components/WaiterRequestModal";
import { SunbedBookingModal } from "./components/SunbedBookingModal";
import { BookingInProgress } from "./components/BookingInProgress";
import { RestaurantMenuModal } from "./components/RestaurantMenuModal";
import { ComingSoonModal } from "./components/ComingSoonModal";
import { ProfileModal } from "./components/ProfileModal";
import { NotificationsList, type WaiterRequest } from "./components/NotificationsList";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

interface Sunbed {
  id: string;
  zone: string;
  status: "available" | "occupied" | "coming-soon" | "maintenance";
  description?: string;
}

export default function App() {
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [currentWaiterRequestSunbedId, setCurrentWaiterRequestSunbedId] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    userName: "John Smith",
    hotelName: "Grand Paradise Resort",
    roomNumber: "305",
    sunbedQuota: 2,
    usedQuota: activeBookings.length,
  });

  // Update guestInfo.usedQuota when activeBookings changes
  const updatedGuestInfo = {
    ...guestInfo,
    usedQuota: activeBookings.length,
  };

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

  const handleBookSunbed = () => {
    const remainingQuota = updatedGuestInfo.sunbedQuota - updatedGuestInfo.usedQuota;
    if (remainingQuota > 0) {
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = (sunbedIds: string[]) => {
    const newBookings = sunbedIds.map(sunbedId => ({ sunbedId, duration: 120 })); // 2 hours default
    setActiveBookings(prev => [...prev, ...newBookings]);
    
    if (sunbedIds.length === 1) {
      toast.success(`Sunbed ${sunbedIds[0]} booked successfully`);
    } else {
      toast.success(`${sunbedIds.length} sunbeds booked successfully: ${sunbedIds.join(", ")}`);
    }
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

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleUsernameUpdate = (newUsername: string) => {
    setGuestInfo(prev => ({ ...prev, userName: newUsername }));
    toast.success("Username updated successfully");
  };

  const handlePasswordUpdate = (currentPassword: string, newPassword: string) => {
    // In a real app, this would make an API call to update the password
    toast.success("Password updated successfully");
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
        onProfileClick={handleProfileClick}
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
          {/* Welcome Section */}
          <WelcomeSection
            userName={updatedGuestInfo.userName}
            hotelName={updatedGuestInfo.hotelName}
            roomNumber={updatedGuestInfo.roomNumber}
            sunbedQuota={updatedGuestInfo.sunbedQuota}
            usedQuota={updatedGuestInfo.usedQuota}
          />

          {/* Global KPI Section */}
          <div className="space-y-4">
            <h1>Sunbed Status</h1>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {kpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  status={kpi.status}
                  onClick={kpi.status === "Available soon" ? () => setIsComingSoonModalOpen(true) : undefined}
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
          <Button
            size="lg"
            className="w-full cursor-pointer bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:border-gray-400 disabled:hover:bg-gray-400 disabled:hover:border-gray-400 touch-manipulation"
            onClick={handleBookSunbed}
            disabled={updatedGuestInfo.usedQuota >= updatedGuestInfo.sunbedQuota}
          >
            {updatedGuestInfo.usedQuota >= updatedGuestInfo.sunbedQuota 
              ? "Quota Reached" 
              : `Book ${updatedGuestInfo.sunbedQuota - updatedGuestInfo.usedQuota > 1 ? "Sunbeds" : "a Sunbed"} (${updatedGuestInfo.sunbedQuota - updatedGuestInfo.usedQuota} left)`}
          </Button>

          {/* Show global Call a Waiter button when there are 0 or 1 bookings */}
          {activeBookings.length <= 1 && (
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 cursor-pointer touch-manipulation"
              onClick={() => {
                setCurrentWaiterRequestSunbedId(activeBookings.length > 0 ? activeBookings[0].sunbedId : undefined);
                setIsWaiterModalOpen(true);
              }}
            >
              Call a Waiter
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full cursor-pointer touch-manipulation"
            onClick={() => setIsMenuModalOpen(true)}
          >
            See the drinks/food
          </Button>
        </div>

        {/* Sunbed Booking Modal */}
        <SunbedBookingModal
          open={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
          onConfirm={handleConfirmBooking}
          availableSunbeds={availableSunbeds}
          remainingQuota={updatedGuestInfo.sunbedQuota - updatedGuestInfo.usedQuota}
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

        {/* Profile Modal */}
        <ProfileModal
          open={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
          currentUsername={guestInfo.userName}
          onUsernameUpdate={handleUsernameUpdate}
          onPasswordUpdate={handlePasswordUpdate}
        />

          {/* Toast Container */}
          <Toaster />
        </div>
      </div>
    </div>
  );
}