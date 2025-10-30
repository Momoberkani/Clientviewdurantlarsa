import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { SunbedPage } from "./components/SunbedPage";
import { RoomServicesPage } from "./components/RoomServicesPage";
import { ProfileModal } from "./components/ProfileModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type PageView = "home" | "sunbeds" | "room";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    userName: "John Smith",
    hotelName: "Grand Paradise Resort",
    roomNumber: "305",
  });

  const handleSelectSunbeds = () => {
    setCurrentPage("sunbeds");
    setIsNotificationsOpen(false); // Close notifications when navigating
  };

  const handleSelectRoom = () => {
    setCurrentPage("room");
    setIsNotificationsOpen(false); // Close notifications when navigating
  };

  const handleSelectActivities = () => {
    setIsActivitiesModalOpen(true);
    setIsNotificationsOpen(false); // Close notifications when opening modal
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setIsNotificationsOpen(false); // Close notifications when navigating
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

  return (
    <>
      {currentPage === "home" && (
        <HomePage 
          onSelectSunbeds={handleSelectSunbeds}
          onSelectRoom={handleSelectRoom}
          onSelectActivities={handleSelectActivities}
          notificationCount={0}
          onNotificationClick={handleNotificationClick}
          isNotificationsOpen={isNotificationsOpen}
          onProfileClick={handleProfileClick}
          userName={guestInfo.userName}
          roomNumber={guestInfo.roomNumber}
        />
      )}
      
      {currentPage === "sunbeds" && (
        <SunbedPage 
          onBack={handleBackToHome}
          guestInfo={guestInfo}
          onUsernameUpdate={handleUsernameUpdate}
          onProfileClick={handleProfileClick}
        />
      )}

      {currentPage === "room" && (
        <RoomServicesPage 
          onBack={handleBackToHome}
          guestInfo={guestInfo}
          onProfileClick={handleProfileClick}
        />
      )}

      {/* Profile Modal - Shared across all pages */}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        currentUsername={guestInfo.userName}
        onUsernameUpdate={handleUsernameUpdate}
        onPasswordUpdate={handlePasswordUpdate}
      />

      {/* Activities Coming Soon Modal */}
      <Dialog open={isActivitiesModalOpen} onOpenChange={setIsActivitiesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hotel Activities - Coming Soon! 🎯</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>
                We're working hard to bring you an amazing selection of activities and services:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">🏖️</span>
                  <span><strong>Excursions:</strong> Beach tours, boat trips, and island adventures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">💆</span>
                  <span><strong>Spa & Wellness:</strong> Massages, facials, and relaxation treatments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">⚽</span>
                  <span><strong>Sports:</strong> Tennis, water sports, fitness classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">🎭</span>
                  <span><strong>Entertainment:</strong> Shows, activities, and special events</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground pt-2">
                In the meantime, please contact our concierge desk for booking assistance.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Toast Container */}
      <Toaster />
    </>
  );
}