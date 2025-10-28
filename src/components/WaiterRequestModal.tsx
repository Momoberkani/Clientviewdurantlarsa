import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { OrderSelectionModal } from "./OrderSelectionModal";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface WaiterRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (option: string, details?: string, sunbedId?: string) => void;
  sunbedId?: string;
}

export function WaiterRequestModal({ open, onOpenChange, onConfirm, sunbedId }: WaiterRequestModalProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [inputSunbedId, setInputSunbedId] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleConfirm = () => {
    if (selectedOption === "order") {
      // Open order selection modal
      setIsOrderModalOpen(true);
    } else if (selectedOption) {
      // Get the final sunbed ID to use
      const finalSunbedId = sunbedId || inputSunbedId;
      onConfirm(selectedOption, selectedOption === "other" ? otherDetails : undefined, finalSunbedId);
      onOpenChange(false);
      // Reset all state
      setSelectedOption("");
      setOtherDetails("");
      setInputSunbedId("");
    }
  };

  const handleOrderConfirm = (orderItems: OrderItem[], total: number, paymentMethod: string) => {
    // Format order details
    const orderDetails = orderItems.map(item => 
      `${item.quantity}x ${item.name} (€${item.price.toFixed(2)})`
    ).join(", ");
    
    const orderSummary = `${orderDetails} | Total: €${total.toFixed(2)} | Payment: ${paymentMethod === "card" ? "Card" : "Cash"}`;
    
    // Get the final sunbed ID to use
    const finalSunbedId = sunbedId || inputSunbedId;
    onConfirm("order", orderSummary, finalSunbedId);
    
    // Close both modals and reset state
    setIsOrderModalOpen(false);
    onOpenChange(false);
    setSelectedOption("");
    setOtherDetails("");
    setInputSunbedId("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSelectedOption("");
      setOtherDetails("");
      setInputSunbedId("");
      setIsOrderModalOpen(false);
    }
  };

  // Determine if service options should be enabled
  const currentSunbedId = sunbedId || inputSunbedId.trim();
  const isServiceEnabled = !!currentSunbedId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Call a Waiter</DialogTitle>
          <DialogDescription>
            {!sunbedId 
              ? "Enter your sunbed number and select what you need from the waiter."
              : `Select what you would like to request from the waiter for Sunbed ${sunbedId}.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Sunbed Input - only show if no sunbedId provided */}
          {!sunbedId && (
            <div className="space-y-2">
              <Label htmlFor="sunbed-input">Sunbed number *</Label>
              <Input
                id="sunbed-input"
                placeholder="Enter sunbed number (e.g., 12)"
                value={inputSunbedId}
                onChange={(e) => setInputSunbedId(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Service Options */}
          <div className="space-y-4">
            <Label className={`block ${!isServiceEnabled ? "text-muted-foreground" : ""}`}>
              Service request {!sunbedId && !isServiceEnabled && "(Enter sunbed number first)"}
            </Label>
            
            <RadioGroup 
              value={selectedOption} 
              onValueChange={isServiceEnabled ? setSelectedOption : undefined}
              disabled={!isServiceEnabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="towel" 
                  id="towel" 
                  disabled={!isServiceEnabled}
                />
                <Label 
                  htmlFor="towel" 
                  className={`cursor-pointer ${!isServiceEnabled ? "text-muted-foreground cursor-not-allowed" : ""}`}
                >
                  Towel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="order" 
                  id="order" 
                  disabled={!isServiceEnabled}
                />
                <Label 
                  htmlFor="order" 
                  className={`cursor-pointer ${!isServiceEnabled ? "text-muted-foreground cursor-not-allowed" : ""}`}
                >
                  Place an order
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="other" 
                  id="other" 
                  disabled={!isServiceEnabled}
                />
                <Label 
                  htmlFor="other" 
                  className={`cursor-pointer ${!isServiceEnabled ? "text-muted-foreground cursor-not-allowed" : ""}`}
                >
                  Other
                </Label>
              </div>
            </RadioGroup>
            
            {selectedOption === "other" && isServiceEnabled && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="other-details">Please specify your request</Label>
                <Textarea
                  id="other-details"
                  placeholder="Describe what you need..."
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedOption || !currentSunbedId}
          className="w-full cursor-pointer"
        >
          {!currentSunbedId 
            ? "Enter sunbed number to continue" 
            : !selectedOption 
              ? "Select a service to continue"
              : selectedOption === "order"
                ? "Choose Items to Order"
                : "Send Request"
          }
        </Button>
      </DialogContent>
      
      {/* Order Selection Modal */}
      <OrderSelectionModal
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
        onConfirm={handleOrderConfirm}
      />
    </Dialog>
  );
}