import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Clock, ShoppingCart, Percent } from "lucide-react";
import { SunbedOrderModal } from "./SunbedOrderModal";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  availableFrom?: string; // Format: "HH:MM"
  availableTo?: string;   // Format: "HH:MM"
  category?: string;
  isPromotion?: boolean;
  originalPrice?: string; // For showing crossed-out price
  discountPercentage?: number;
  promotionText?: string;
}

interface RestaurantMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPlaced?: (orderItems: any[], total: number, paymentMethod: string, sunbedId?: string) => void;
}

export function RestaurantMenuModal({ open, onOpenChange, onOrderPlaced }: RestaurantMenuModalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const drinks: MenuItem[] = [
    { 
      name: "Watermelon Mint Cooler", 
      price: "€3.50", 
      originalPrice: "€6.00",
      description: "Fresh watermelon juice with mint and lime - perfect for hot days", 
      isPromotion: true,
      discountPercentage: 42,
      promotionText: "Our Choice"
    },
    { 
      name: "Lemonade", 
      price: "€2.50", 
      originalPrice: "€3.50",
      description: "Freshly squeezed lemon with sparkling water", 
      isPromotion: true,
      discountPercentage: 30,
      promotionText: "Daily Special"
    },
    { name: "Fresh Orange Juice", price: "€4.50", description: "Freshly squeezed oranges", availableFrom: "07:00", availableTo: "11:00", category: "Breakfast Drinks" },
    { 
      name: "Tropical Smoothie", 
      price: "€4.50", 
      originalPrice: "€6.00",
      description: "Mango, pineapple, coconut", 
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Happy Hour Special",
      availableFrom: "14:00",
      availableTo: "17:00"
    },
    { name: "Iced Coffee", price: "€3.50", description: "Cold brew with ice" },
    { name: "Mojito", price: "€8.00", description: "Rum, mint, lime, soda", availableFrom: "16:00", availableTo: "23:00", category: "Evening Cocktails" },
    { name: "Water", price: "€2.00", description: "Still or sparkling" },
    { 
      name: "Beer", 
      price: "€3.00", 
      originalPrice: "€4.00",
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
      name: "Mediterranean Bowl", 
      price: "€8.50", 
      originalPrice: "€14.50",
      description: "Quinoa, grilled vegetables, hummus, feta cheese, olives, and tahini dressing", 
      isPromotion: true,
      discountPercentage: 41,
      promotionText: "Our Choice"
    },
    { 
      name: "Greek Salad", 
      price: "€7.50", 
      originalPrice: "€10.00",
      description: "Fresh tomatoes, cucumber, olives, feta cheese", 
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Chef's Special"
    },
    { name: "Club Sandwich", price: "€12.00", description: "Chicken, bacon, lettuce, tomato", availableFrom: "11:00", availableTo: "16:00", category: "Lunch Menu" },
    { name: "Caesar Salad", price: "€10.00", description: "Romaine, parmesan, croutons", availableFrom: "11:00", availableTo: "16:00", category: "Lunch Menu" },
    { 
      name: "Fish & Chips", 
      price: "€10.50", 
      originalPrice: "€14.00",
      description: "Fresh fish with fries", 
      availableFrom: "11:00", 
      availableTo: "14:00", 
      category: "Main Courses",
      isPromotion: true,
      discountPercentage: 25,
      promotionText: "Lunch Deal"
    },
    { name: "Margherita Pizza", price: "€11.00", description: "Tomato, mozzarella, basil", availableFrom: "18:00", availableTo: "22:00", category: "Dinner Menu" },
    { name: "Fruit Plate", price: "€8.00", description: "Seasonal fresh fruits" },
    { name: "Nachos", price: "€9.00", description: "With guacamole and salsa" }
  ];

  const isItemAvailable = (item: MenuItem): boolean => {
    if (!item.availableFrom || !item.availableTo) {
      return true; // Always available if no time restrictions
    }

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

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

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const handleOrderPlaced = (orderItems: any[], total: number, paymentMethod: string, sunbedId?: string) => {
    if (onOrderPlaced) {
      onOrderPlaced(orderItems, total, paymentMethod, sunbedId);
    }
    setIsOrderModalOpen(false);
  };

  return (
    <>
      <SunbedOrderModal 
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
        onOrderPlaced={handleOrderPlaced}
      />
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Restaurant Menu
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Browse our selection of drinks and food available for order. Some items are only available during specific hours.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="drinks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>
          
          <TabsContent value="drinks" className="space-y-4 mt-4">
            <div className="grid gap-3">
              {drinks.map((item, index) => {
                const available = isItemAvailable(item);
                const availabilityText = getAvailabilityText(item);
                const isFeaturedDeal = item.promotionText?.includes("Our Choice") && item.isPromotion;
                
                return (
                  <Card key={index} className={`${!available ? "opacity-60 bg-muted/30" : ""} ${
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
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className={`font-medium ${!available ? "text-muted-foreground" : ""} ${isFeaturedDeal ? "text-red-800" : ""}`}>
                              {item.name}
                            </h4>
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
                          <p className={`text-sm mt-1 ${!available ? "text-muted-foreground" : "text-muted-foreground"}`}>
                            {item.description}
                          </p>
                          {availabilityText && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${!available ? "text-orange-600 font-medium" : "text-muted-foreground"}`}>
                              <Clock className="h-3 w-3" />
                              {availabilityText}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          {item.isPromotion && item.originalPrice && available ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-muted-foreground line-through">
                                {item.originalPrice}
                              </span>
                              <span className={`font-medium ${isFeaturedDeal ? "text-red-600 text-lg" : "text-orange-600"}`}>
                                {item.price}
                              </span>
                            </div>
                          ) : (
                            <span className={`font-medium ${!available ? "text-muted-foreground" : "text-primary"}`}>
                              {item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="food" className="space-y-4 mt-4">
            <div className="grid gap-3">
              {food.map((item, index) => {
                const available = isItemAvailable(item);
                const availabilityText = getAvailabilityText(item);
                const isFeaturedDeal = item.promotionText?.includes("Our Choice") && item.isPromotion;
                
                return (
                  <Card key={index} className={`${!available ? "opacity-60 bg-muted/30" : ""} ${
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
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className={`font-medium ${!available ? "text-muted-foreground" : ""} ${isFeaturedDeal ? "text-red-800" : ""}`}>
                              {item.name}
                            </h4>
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
                          <p className={`text-sm mt-1 ${!available ? "text-muted-foreground" : "text-muted-foreground"}`}>
                            {item.description}
                          </p>
                          {availabilityText && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${!available ? "text-orange-600 font-medium" : "text-muted-foreground"}`}>
                              <Clock className="h-3 w-3" />
                              {availabilityText}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          {item.isPromotion && item.originalPrice && available ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-muted-foreground line-through">
                                {item.originalPrice}
                              </span>
                              <span className={`font-medium ${isFeaturedDeal ? "text-red-600 text-lg" : "text-orange-600"}`}>
                                {item.price}
                              </span>
                            </div>
                          ) : (
                            <span className={`font-medium ${!available ? "text-muted-foreground" : "text-primary"}`}>
                              {item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Order Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleOrderClick}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Place an Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}