import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { OrderSelectionModal } from "./OrderSelectionModal";

interface SunbedOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPlaced?: (orderItems: any[], total: number, paymentMethod: string, sunbedId: string) => void;
}

export function SunbedOrderModal({ open, onOpenChange, onOrderPlaced }: SunbedOrderModalProps) {
  const [sunbedId, setSunbedId] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleProceed = () => {
    if (sunbedId.trim()) {
      setIsOrderModalOpen(true);
    }
  };

  const handleOrderPlaced = (orderItems: any[], total: number, paymentMethod: string) => {
    if (onOrderPlaced) {
      onOrderPlaced(orderItems, total, paymentMethod, sunbedId.trim());
    }
    setIsOrderModalOpen(false);
    onOpenChange(false);
    setSunbedId("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSunbedId("");
      setIsOrderModalOpen(false);
    }
  };

  return (
    <>
      <OrderSelectionModal 
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
        onConfirm={handleOrderPlaced}
      />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place an Order</DialogTitle>
            <DialogDescription>
              Enter your sunbed number to proceed with placing your food and drink order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sunbed-input">Sunbed number *</Label>
              <Input
                id="sunbed-input"
                placeholder="Enter sunbed number (e.g., A1, B5, C3)"
                value={sunbedId}
                onChange={(e) => setSunbedId(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <Button 
            onClick={handleProceed} 
            disabled={!sunbedId.trim()}
            className="w-full cursor-pointer"
          >
            {!sunbedId.trim() 
              ? "Enter sunbed number to continue" 
              : "Continue to Menu"
            }
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}