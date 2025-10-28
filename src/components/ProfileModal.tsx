import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useIsMobile } from "./ui/use-mobile";
import { User, Lock, Save } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
  onUsernameUpdate: (newUsername: string) => void;
  onPasswordUpdate: (currentPassword: string, newPassword: string) => void;
}

export function ProfileModal({ 
  open, 
  onOpenChange, 
  currentUsername, 
  onUsernameUpdate, 
  onPasswordUpdate 
}: ProfileModalProps) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleUsernameUpdate = async () => {
    if (newUsername.trim() && newUsername !== currentUsername) {
      setIsUpdatingUsername(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUsernameUpdate(newUsername.trim());
      setIsUpdatingUsername(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (currentPassword && newPassword && newPassword === confirmPassword && newPassword.length >= 8) {
      setIsUpdatingPassword(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPasswordUpdate(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatingPassword(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
      setNewUsername(currentUsername);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    onOpenChange(isOpen);
  };

  const isUsernameValid = newUsername.trim().length > 0 && newUsername !== currentUsername;
  const isPasswordValid = currentPassword.length > 0 && 
                          newPassword.length >= 8 && 
                          newPassword === confirmPassword;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[85vh]" : "sm:max-w-md h-[80vh]"} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update your username or change your password.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
          {/* Username Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Username (login ID)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className={isMobile ? "h-12 text-base" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  This is how you'll be addressed throughout the app.
                </p>
              </div>
              
              <Button
                onClick={handleUsernameUpdate}
                disabled={!isUsernameValid || isUpdatingUsername}
                className="w-full"
                size={isMobile ? "lg" : "default"}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdatingUsername ? "Updating..." : "Update Username"}
              </Button>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4" />
                Change my password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={isMobile ? "h-12 text-base" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={isMobile ? "h-12 text-base" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={isMobile ? "h-12 text-base" : ""}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    Passwords do not match.
                  </p>
                )}
              </div>
              
              <Button
                onClick={handlePasswordUpdate}
                disabled={!isPasswordValid || isUpdatingPassword}
                className="w-full"
                size={isMobile ? "lg" : "default"}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isUpdatingPassword ? "Updating..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}