import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useIsMobile } from "./ui/use-mobile";
import { Clock, Plus, Minus, ShoppingCart, CreditCard, Banknote, ChevronLeft, Home, Percent } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  availableFrom?: string;
  availableTo?: string;
  category?: string;
  isPromotion?: boolean;
  originalPrice?: number;
  discountPercentage?: number;
  promotionText?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface OrderSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (orderItems: OrderItem[], total: number, paymentMethod: string) => void;
}

export function OrderSelectionModal({ open, onOpenChange, onConfirm }: OrderSelectionModalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState<Map<string, OrderItem>>(new Map());
  const [currentStep, setCurrentStep] = useState<"menu" | "payment">("menu");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "room" | "">(""); 
  const [showMobileOrderSummary, setShowMobileOrderSummary] = useState(false);
  const isMobile = useIsMobile();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const drinks: MenuItem[] = [
    { 
      id: "d1", 
      name: "Watermelon Mint Cooler", 
      price: 3.50, 
      originalPrice: 6.00,
      description: "Fresh watermelon juice with mint and lime - perfect for hot days", 
      isPromotion: true,
      discountPercentage: 42,
      promotionText: "Our Choice"
    },
    { 
      id: "d2", 
      name: "Lemonade", 
      price: 2.50, 
      originalPrice: 3.50,
      description: "Freshly squeezed lemon with sparkling water", 
      isPromotion: true,
      discountPercentage: 30,
      promotionText: "Daily Special"
    },
    { id: "d3", name: "Fresh Orange Juice", price: 4.50, description: "Freshly squeezed oranges", availableFrom: "07:00", availableTo: "11:00", category: "Breakfast Drinks" },
    { 
      id: "d4", 
      name: "Tropical Smoothie", 
      price: 4.50, 
      originalPrice: 6.00,
      description: "Mango, pineapple, coconut", 
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Happy Hour Special",
      availableFrom: "14:00",
      availableTo: "17:00"
    },
    { id: "d5", name: "Iced Coffee", price: 3.50, description: "Cold brew with ice" },
    { id: "d6", name: "Mojito", price: 8.00, description: "Rum, mint, lime, soda", availableFrom: "16:00", availableTo: "23:00", category: "Evening Cocktails" },
    { id: "d7", name: "Water", price: 2.00, description: "Still or sparkling" },
    { 
      id: "d8", 
      name: "Beer", 
      price: 3.00, 
      originalPrice: 4.00,
      description: "Local draft beer", 
      availableFrom: "16:00", 
      availableTo: "19:00", 
      category: "Alcoholic Beverages",
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Sunset Special"
    }
  ];

  const food: MenuItem[] = [
    { 
      id: "f1", 
      name: "Mediterranean Bowl", 
      price: 8.50, 
      originalPrice: 14.50,
      description: "Quinoa, grilled vegetables, hummus, feta cheese, olives, and tahini dressing", 
      isPromotion: true,
      discountPercentage: 41,
      promotionText: "Our Choice"
    },
    { 
      id: "f2", 
      name: "Greek Salad", 
      price: 7.50, 
      originalPrice: 10.00,
      description: "Fresh tomatoes, cucumber, olives, feta cheese", 
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Chef's Special"
    },
    { id: "f3", name: "Club Sandwich", price: 12.00, description: "Chicken, bacon, lettuce, tomato", availableFrom: "11:00", availableTo: "16:00", category: "Lunch Menu" },
    { id: "f4", name: "Caesar Salad", price: 10.00, description: "Romaine, parmesan, croutons", availableFrom: "11:00", availableTo: "16:00", category: "Lunch Menu" },
    { 
      id: "f5", 
      name: "Fish & Chips", 
      price: 10.50, 
      originalPrice: 14.00,
      description: "Fresh fish with fries", 
      availableFrom: "11:00", 
      availableTo: "14:00", 
      category: "Main Courses",
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Lunch Deal"
    },
    { id: "f6", name: "Margherita Pizza", price: 11.00, description: "Tomato, mozzarella, basil", availableFrom: "18:00", availableTo: "22:00", category: "Dinner Menu" },
    { id: "f7", name: "Fruit Plate", price: 8.00, description: "Seasonal fresh fruits" },
    { id: "f8", name: "Nachos", price: 9.00, description: "With guacamole and salsa" }
  ];

  const isItemAvailable = (item: MenuItem): boolean => {
    if (!item.availableFrom || !item.availableTo) {
      return true;
    }

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const [fromHour, fromMinute] = item.availableFrom.split(':').map(Number);
    const [toHour, toMinute] = item.availableTo.split(':').map(Number);

    const fromTime = fromHour * 60 + fromMinute;
    const toTime = toHour * 60 + toMinute;
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    return currentTimeMinutes >= fromTime && currentTimeMinutes <= toTime;
  };

  const getAvailabilityText = (item: MenuItem): string => {
    if (!item.availableFrom || !item.availableTo) {
      return "";
    }
    return `Available ${item.availableFrom} - ${item.availableTo}`;
  };

  const handleItemToggle = (item: MenuItem, checked: boolean) => {
    const newSelectedItems = new Map(selectedItems);
    
    if (checked) {
      newSelectedItems.set(item.id, { ...item, quantity: 1 });
    } else {
      newSelectedItems.delete(item.id);
    }
    
    setSelectedItems(newSelectedItems);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const newSelectedItems = new Map(selectedItems);
    const item = newSelectedItems.get(itemId);
    
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      if (newQuantity === 0) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.set(itemId, { ...item, quantity: newQuantity });
      }
      setSelectedItems(newSelectedItems);
    }
  };

  const calculateTotal = (): number => {
    return Array.from(selectedItems.values()).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleConfirm = () => {
    const orderItems = Array.from(selectedItems.values());
    const total = calculateTotal();
    onConfirm(orderItems, total, paymentMethod);
    onOpenChange(false);
    setSelectedItems(new Map());
    setCurrentStep("menu");
    setPaymentMethod("");
    setShowMobileOrderSummary(false);
  };

  const handleProceedToPayment = () => {
    setCurrentStep("payment");
    setShowMobileOrderSummary(false);
  };

  const handleBackToMenu = () => {
    setCurrentStep("menu");
    setPaymentMethod("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSelectedItems(new Map());
      setCurrentStep("menu");
      setPaymentMethod("");
      setShowMobileOrderSummary(false);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const available = isItemAvailable(item);
    const availabilityText = getAvailabilityText(item);
    const isSelected = selectedItems.has(item.id);
    const selectedItem = selectedItems.get(item.id);
    const isFeaturedDeal = item.promotionText?.includes("Our Choice") && item.isPromotion;

    return (
      <Card key={item.id} className={`${!available ? "opacity-60 bg-muted/30" : ""} ${
        item.isPromotion && available 
          ? isFeaturedDeal 
            ? "border-2 border-gradient-to-r from-orange-400 to-red-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg relative overflow-hidden" 
            : "border-orange-200 bg-orange-50/50" 
          : ""
      }`}>
        {isFeaturedDeal && available && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-2 py-1 rounded-br-lg">
            ⭐
          </div>
        )}
        <CardContent className={`${isMobile ? "p-4" : "p-4"}`}>
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => handleItemToggle(item, !!checked)}
              disabled={!available}
              className={`mt-1 ${isMobile ? "h-5 w-5" : ""} touch-manipulation`}
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Label 
                  className={`cursor-pointer ${!available ? "text-muted-foreground" : ""} ${isFeaturedDeal ? "text-red-800" : ""} ${isMobile ? "text-base" : ""} touch-manipulation`}
                  onClick={() => handleItemToggle(item, !isSelected)}
                >
                  {item.name}
                </Label>
                {!available && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Unavailable
                  </Badge>
                )}
                {item.isPromotion && available && (
                  <Badge className={`text-xs ${isFeaturedDeal ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" : "bg-orange-600 hover:bg-orange-700"}`}>
                    <Percent className="h-3 w-3 mr-1" />
                    {item.discountPercentage}% OFF
                  </Badge>
                )}
                {item.promotionText && item.isPromotion && available && item.promotionText !== "Our Choice" && (
                  <Badge variant="outline" className={`text-xs ${isFeaturedDeal ? "border-red-400 text-red-700 bg-red-50" : "border-orange-300 text-orange-700"}`}>
                    {item.promotionText}
                  </Badge>
                )}
                {item.category && available && !item.isPromotion && (
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                )}
              </div>
              <p className={`text-sm ${!available ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {item.description}
              </p>
              {availabilityText && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${!available ? "text-orange-600 font-medium" : "text-muted-foreground"}`}>
                  <Clock className="h-3 w-3" />
                  {availabilityText}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {item.isPromotion && item.originalPrice && available ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground line-through">
                    €{item.originalPrice.toFixed(2)}
                  </span>
                  <span className={`font-medium ${isFeaturedDeal ? "text-red-600" : "text-orange-600"}`}>
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className={`font-medium ${!available ? "text-muted-foreground" : "text-primary"}`}>
                  €{item.price.toFixed(2)}
                </span>
              )}
              
              {isSelected && selectedItem && (
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isMobile ? "h-8 w-8" : "h-7 w-7"} p-0 touch-manipulation`}
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Minus className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                  </Button>
                  <span className="min-w-[2ch] text-center text-sm font-medium px-1">
                    {selectedItem.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isMobile ? "h-8 w-8" : "h-7 w-7"} p-0 touch-manipulation`}
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Plus className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const selectedItemsArray = Array.from(selectedItems.values());
  const total = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="flex items-center justify-between text-base sm:text-lg">
            <div className="flex items-center gap-2">
              {currentStep === "payment" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 sm:hidden"
                  onClick={handleBackToMenu}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {currentStep === "menu" ? "Place Your Order" : "Payment Method"}
            </div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {currentStep === "menu" 
              ? "Select items from our menu. You can adjust quantities and see your total before placing the order."
              : "Choose how you would like to pay for your order."
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Menu Step */}
        {currentStep === "menu" && (
          <div className="flex-1 overflow-hidden flex flex-col sm:flex-row gap-0 sm:gap-4 p-4 sm:p-6 pt-0">
            {/* Menu Selection */}
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="drinks" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="drinks">Drinks</TabsTrigger>
                  <TabsTrigger value="food">Food</TabsTrigger>
                </TabsList>
                
                <TabsContent value="drinks" className="space-y-3 mt-0">
                  {drinks.map(renderMenuItem)}
                </TabsContent>
                
                <TabsContent value="food" className="space-y-3 mt-0">
                  {food.map(renderMenuItem)}
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Summary - Desktop */}
            <div className="hidden sm:block w-80 border-l pl-4">
              <div className="sticky top-0">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="h-5 w-5" />
                  <h3 className="font-medium">Your Order</h3>
                  {selectedItemsArray.length > 0 && (
                    <Badge variant="secondary">{selectedItemsArray.length}</Badge>
                  )}
                </div>

                {selectedItemsArray.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items selected</p>
                ) : (
                  <div className="space-y-3">
                    {selectedItemsArray.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">
                            €{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleProceedToPayment}
                  disabled={selectedItemsArray.length === 0}
                  className="w-full mt-4"
                >
                  Continue to Payment ({selectedItemsArray.length} items)
                </Button>
              </div>
            </div>

            {/* Mobile Order Summary Toggle */}
            <div className="sm:hidden border-t pt-4 mt-4">
              {selectedItemsArray.length > 0 && !showMobileOrderSummary && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedItemsArray.length} items • €{total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileOrderSummary(true)}
                    className="text-xs"
                  >
                    View Order
                  </Button>
                </div>
              )}

              {showMobileOrderSummary && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <h3 className="text-sm font-medium">Your Order</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileOrderSummary(false)}
                      className="text-xs"
                    >
                      Hide
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedItemsArray.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">
                            €{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleProceedToPayment}
                disabled={selectedItemsArray.length === 0}
                className="w-full"
              >
                Continue to Payment ({selectedItemsArray.length} items)
              </Button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-0">
            <div className="max-w-md mx-auto space-y-6">
              {/* Order Summary for Payment Step */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    {selectedItemsArray.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">
                            €{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Choose Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "cash" | "room")}>
                    <div className={`flex items-center space-x-3 ${isMobile ? "p-4" : "p-3"} rounded-lg border hover:bg-accent cursor-pointer touch-manipulation`}>
                      <RadioGroupItem value="card" id="card" className={isMobile ? "h-5 w-5" : ""} />
                      <Label htmlFor="card" className="cursor-pointer flex items-center gap-3 flex-1 touch-manipulation">
                        <CreditCard className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
                        <div>
                          <div className={`font-medium ${isMobile ? "text-base" : ""}`}>Credit/Debit Card</div>
                          <div className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>Pay with your card</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-3 ${isMobile ? "p-4" : "p-3"} rounded-lg border hover:bg-accent cursor-pointer touch-manipulation`}>
                      <RadioGroupItem value="cash" id="cash" className={isMobile ? "h-5 w-5" : ""} />
                      <Label htmlFor="cash" className="cursor-pointer flex items-center gap-3 flex-1 touch-manipulation">
                        <Banknote className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
                        <div>
                          <div className={`font-medium ${isMobile ? "text-base" : ""}`}>Cash</div>
                          <div className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>Pay with cash upon delivery</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-3 ${isMobile ? "p-4" : "p-3"} rounded-lg border hover:bg-accent cursor-pointer touch-manipulation`}>
                      <RadioGroupItem value="room" id="room" className={isMobile ? "h-5 w-5" : ""} />
                      <Label htmlFor="room" className="cursor-pointer flex items-center gap-3 flex-1 touch-manipulation">
                        <Home className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
                        <div>
                          <div className={`font-medium ${isMobile ? "text-base" : ""}`}>Charge the Room</div>
                          <div className={`${isMobile ? "text-sm" : "text-xs"} text-muted-foreground`}>Add to your room bill</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToMenu}
                  className="w-full sm:w-auto"
                >
                  Back to Menu
                </Button>
                <Button 
                  onClick={handleConfirm}
                  disabled={!paymentMethod}
                  className="w-full sm:flex-1"
                >
                  Place Order • €{total.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}