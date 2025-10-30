import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { SunbedPage } from "./components/SunbedPage";
import { RoomServicesPage } from "./components/RoomServicesPage";
import { ProfileModal } from "./components/ProfileModal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type PageView = "home" | "sunbeds" | "room";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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

      {/* Toast Container */}
      <Toaster />
    </>
  );
}