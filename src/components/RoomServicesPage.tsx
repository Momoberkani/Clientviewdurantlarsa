import { useState } from "react";
import { TopBar } from "./TopBar";
import { Card, CardContent } from "./ui/card";
import { ServiceRequestCard } from "./ServiceRequestCard";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useIsMobile } from "./ui/use-mobile";
import { toast } from "sonner@2.0.3";
import { Badge } from "./ui/badge";
import { 
  Sparkles, 
  UtensilsCrossed, 
  DoorClosed, 
  HelpCircle, 
  AlertTriangle, 
  MessageSquare,
  Clock,
  ArrowLeft,
  Users,
  CreditCard,
  Calendar,
  Info,
  Baby,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Merge
} from "lucide-react";

interface RoomServicesPageProps {
  onBack: () => void;
  guestInfo: {
    userName: string;
    hotelName: string;
    roomNumber: string;
  };
  onProfileClick: () => void;
}

type ServiceType = "cleaning" | "food" | "doNotDisturb" | "questions" | "problem" | "other";

interface ServiceRequest {
  id: number;
  type: ServiceType;
  description: string;
  timestamp: Date;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  details?: string;
  estimatedTime?: string;
  queuePosition?: number;
}

export function RoomServicesPage({ onBack, guestInfo, onProfileClick }: RoomServicesPageProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChargesModalOpen, setIsChargesModalOpen] = useState(false);
  const [isLateCheckoutModalOpen, setIsLateCheckoutModalOpen] = useState(false);
  const [isKidsClubModalOpen, setIsKidsClubModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const isMobile = useIsMobile();

  // Mock children data (set to empty array if no children)
  const [children, setChildren] = useState([
    { id: 1, name: "Emma", age: 7, enrolled: true },
    { id: 2, name: "Lucas", age: 5, enrolled: false },
  ]);
  
  // Kids club enrollment state
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");

  // Room information (mock data)
  const roomInfo = {
    numberOfGuests: 4,
    numberOfAdults: 2,
    numberOfChildren: 2,
    plan: "All Inclusive",
    canChargeToRoom: true,
    totalCharges: 287.50,
    checkOutDate: "November 10, 2025",
    checkOutTime: "11:00 AM",
    lateCheckoutPrice: 45.00,
    lateCheckoutTime: "3:00 PM"
  };

  // Mock charges data
  const charges = [
    { date: "Nov 6", description: "Room Service - Breakfast", amount: 42.00 },
    { date: "Nov 6", description: "Minibar", amount: 18.50 },
    { date: "Nov 5", description: "Spa Treatment", amount: 125.00 },
    { date: "Nov 5", description: "Restaurant - Dinner", amount: 87.00 },
    { date: "Nov 4", description: "Laundry Service", amount: 15.00 },
  ];

  // Cleaning modal state
  const [cleaningType, setCleaningType] = useState<string>("full");
  const [cleaningNotes, setCleaningNotes] = useState("");

  // Food order modal state
  const [foodRequest, setFoodRequest] = useState("");
  const [selectedMenuItems, setSelectedMenuItems] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState("breakfast");

  // Menu data
  const menuCategories = [
    { id: "breakfast", name: "Breakfast" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
  ];

  const menuItems = {
    breakfast: [
      { id: "continental", name: "Continental Breakfast", price: 18.00, description: "Croissants, toast, jam, butter, coffee or tea" },
      { id: "american", name: "American Breakfast", price: 24.00, description: "Eggs, bacon, sausage, hash browns, toast" },
      { id: "pancakes", name: "Pancakes Stack", price: 16.00, description: "Three fluffy pancakes with maple syrup and butter" },
      { id: "omelette", name: "Custom Omelette", price: 19.00, description: "Three eggs with choice of fillings" },
    ],
    mains: [
      { id: "burger", name: "Classic Burger", price: 22.00, description: "Beef patty, lettuce, tomato, cheese, fries" },
      { id: "salmon", name: "Grilled Salmon", price: 32.00, description: "With seasonal vegetables and lemon butter" },
      { id: "pasta", name: "Pasta Carbonara", price: 24.00, description: "Creamy carbonara with bacon and parmesan" },
      { id: "caesar", name: "Caesar Salad", price: 18.00, description: "Romaine lettuce, croutons, parmesan, caesar dressing" },
    ],
    desserts: [
      { id: "tiramisu", name: "Tiramisu", price: 12.00, description: "Classic Italian coffee-flavored dessert" },
      { id: "cheesecake", name: "New York Cheesecake", price: 11.00, description: "Rich and creamy with berry compote" },
      { id: "chocolate", name: "Chocolate Lava Cake", price: 13.00, description: "Warm chocolate cake with vanilla ice cream" },
      { id: "fruit", name: "Fresh Fruit Platter", price: 10.00, description: "Seasonal fresh fruits" },
    ],
    beverages: [
      { id: "coffee", name: "Coffee", price: 5.00, description: "Freshly brewed coffee" },
      { id: "tea", name: "Tea Selection", price: 5.00, description: "Choice of black, green, or herbal tea" },
      { id: "juice", name: "Fresh Juice", price: 7.00, description: "Orange, apple, or grapefruit" },
      { id: "water", name: "Sparkling Water", price: 6.00, description: "500ml bottle" },
    ],
  };

  // Do Not Disturb state
  const [doNotDisturbEnabled, setDoNotDisturbEnabled] = useState(false);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState("14:00");
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState("16:00");

  // Questions modal state
  const [question, setQuestion] = useState("");
  const [selectedQuestionsToMerge, setSelectedQuestionsToMerge] = useState<number[]>([]);
  const [isMergeMode, setIsMergeMode] = useState(false);

  // Problem modal state
  const [problemType, setProblemType] = useState<string>("maintenance");
  const [problemDescription, setProblemDescription] = useState("");

  // Other service state
  const [otherRequest, setOtherRequest] = useState("");

  const services = [
    {
      id: "cleaning" as ServiceType,
      title: "Housekeeping",
      description: "Request cleaning service for your room",
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "food" as ServiceType,
      title: "Room Service",
      description: "Order food and beverages to your room",
      icon: <UtensilsCrossed className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "doNotDisturb" as ServiceType,
      title: "Do Not Disturb",
      description: "Set up quiet hours for your room",
      icon: <DoorClosed className="h-6 w-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "questions" as ServiceType,
      title: "Ask Questions",
      description: "Get assistance from our concierge",
      icon: <HelpCircle className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "problem" as ServiceType,
      title: "Report a Problem",
      description: "Signal maintenance or other issues",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "other" as ServiceType,
      title: "Other Services",
      description: "Request any other room service",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const handleServiceClick = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    // Reset all form states
    setCleaningType("full");
    setCleaningNotes("");
    setFoodRequest("");
    setQuestion("");
    setProblemType("maintenance");
    setProblemDescription("");
    setOtherRequest("");
  };

  const handleSubmitCleaning = () => {
    const queueInfo = calculateQueueInfo("cleaning");
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "cleaning",
      description: `Requested ${cleaningType} cleaning`,
      timestamp: new Date(),
      status: "pending",
      details: cleaningNotes,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.success("Housekeeping request submitted", {
      description: `Your ${cleaningType} cleaning request has been sent. Estimated time: ${queueInfo.estimatedTime}`,
    });
    handleCloseModal();
  };

  const handleSubmitFood = () => {
    const queueInfo = calculateQueueInfo("food");
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "food",
      description: "Ordered food and beverages",
      timestamp: new Date(),
      status: "pending",
      details: foodRequest,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.success("Room service order submitted", {
      description: `Your food order has been sent. Estimated delivery: ${queueInfo.estimatedTime}`,
    });
    handleCloseModal();
  };

  const handleSubmitDoNotDisturb = () => {
    setDoNotDisturbEnabled(!doNotDisturbEnabled);
    if (!doNotDisturbEnabled) {
      toast.success("Do Not Disturb activated", {
        description: `Active from ${doNotDisturbStart} to ${doNotDisturbEnd}`,
      });
    } else {
      toast.success("Do Not Disturb deactivated");
    }
    handleCloseModal();
  };

  const handleSubmitQuestion = () => {
    const queueInfo = calculateQueueInfo("questions");
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "questions",
      description: "Asked a question",
      timestamp: new Date(),
      status: "pending",
      details: question,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.success("Question sent to concierge", {
      description: `We'll respond in approximately ${queueInfo.estimatedTime}`,
    });
    handleCloseModal();
  };

  const handleSubmitProblem = () => {
    const queueInfo = calculateQueueInfo("problem");
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "problem",
      description: "Reported a problem",
      timestamp: new Date(),
      status: "pending",
      details: problemDescription,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.success("Problem report submitted", {
      description: `Our maintenance team will address this in ${queueInfo.estimatedTime}`,
    });
    handleCloseModal();
  };

  const handleSubmitOther = () => {
    const queueInfo = calculateQueueInfo("other");
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "other",
      description: "Requested other service",
      timestamp: new Date(),
      status: "pending",
      details: otherRequest,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.success("Service request submitted", {
      description: `We'll process your request in ${queueInfo.estimatedTime}`,
    });
    handleCloseModal();
  };

  const handleLateCheckoutRequest = () => {
    toast.success("Late checkout request submitted", {
      description: `Your request for late checkout until ${roomInfo.lateCheckoutTime} has been sent. A charge of €${roomInfo.lateCheckoutPrice.toFixed(2)} will be added to your room.`,
    });
    setIsLateCheckoutModalOpen(false);
  };

  const handleKidsClubEnrollment = () => {
    if (newChildName && newChildAge) {
      const newChild = { id: children.length + 1, name: newChildName, age: parseInt(newChildAge), enrolled: true };
      setChildren([...children, newChild]);
      setNewChildName("");
      setNewChildAge("");
      toast.success("Child enrolled in Kids Club", {
        description: `${newChildName} has been added to the Kids Club.`,
      });
    } else {
      toast.error("Please enter a name and age for the child.");
    }
  };

  const addMenuItem = (itemId: string) => {
    setSelectedMenuItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeMenuItem = (itemId: string) => {
    setSelectedMenuItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId]--;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(selectedMenuItems).forEach(([itemId, quantity]) => {
      const category = menuCategories.find(cat => 
        menuItems[cat.id as keyof typeof menuItems].some(item => item.id === itemId)
      );
      if (category) {
        const item = menuItems[category.id as keyof typeof menuItems].find(item => item.id === itemId);
        if (item) {
          total += item.price * quantity;
        }
      }
    });
    return total;
  };

  const getTotalItems = () => {
    return Object.values(selectedMenuItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getServiceRequestCount = (serviceType: ServiceType) => {
    return serviceRequests.filter(req => req.type === serviceType && req.status !== "completed").length;
  };

  const getServiceRequests = (serviceType: ServiceType) => {
    return serviceRequests.filter(req => req.type === serviceType);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancelRequest = (requestId: number) => {
    setServiceRequests(prev => 
      prev.filter(req => req.id !== requestId)
    );
    toast.success("Request cancelled", {
      description: "Your service request has been cancelled successfully.",
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const calculateQueueInfo = (type: ServiceType) => {
    const pendingRequests = serviceRequests.filter(
      req => req.type === type && (req.status === "pending" || req.status === "in-progress")
    );
    const queuePosition = pendingRequests.length + 1;
    
    // Calculate estimated time based on service type and queue position
    let estimatedTime = "";
    if (type === "food") {
      const baseTime = 25; // base 25 minutes
      const additionalTime = (queuePosition - 1) * 15; // 15 min per order ahead
      estimatedTime = `${baseTime + additionalTime}-${baseTime + additionalTime + 10} min`;
    } else if (type === "cleaning") {
      const baseTime = 15;
      const additionalTime = (queuePosition - 1) * 20;
      estimatedTime = `${baseTime + additionalTime}-${baseTime + additionalTime + 10} min`;
    } else if (type === "questions") {
      const baseTime = 5;
      const additionalTime = (queuePosition - 1) * 5;
      estimatedTime = `${baseTime + additionalTime}-${baseTime + additionalTime + 5} min`;
    } else if (type === "problem") {
      const baseTime = 10;
      const additionalTime = (queuePosition - 1) * 15;
      estimatedTime = `${baseTime + additionalTime}-${baseTime + additionalTime + 10} min`;
    } else {
      const baseTime = 10;
      const additionalTime = (queuePosition - 1) * 10;
      estimatedTime = `${baseTime + additionalTime}-${baseTime + additionalTime + 10} min`;
    }
    
    return { queuePosition, estimatedTime };
  };

  const handleSubmitMenuOrder = () => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const queueInfo = calculateQueueInfo("food");
    
    const newRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "food",
      description: "Ordered food and beverages",
      timestamp: new Date(),
      status: "pending",
      details: `Ordered ${totalItems} item${totalItems > 1 ? 's' : ''} for €${totalPrice.toFixed(2)}`,
      estimatedTime: queueInfo.estimatedTime,
      queuePosition: queueInfo.queuePosition
    };
    setServiceRequests([...serviceRequests, newRequest]);
    
    toast.success("Room service order placed", {
      description: `${totalItems} item${totalItems > 1 ? 's' : ''} ordered. Estimated delivery: ${queueInfo.estimatedTime}`,
    });
    setSelectedMenuItems({});
    handleCloseModal();
  };

  const toggleQuestionSelection = (requestId: number) => {
    setSelectedQuestionsToMerge(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const handleMergeQuestions = () => {
    if (selectedQuestionsToMerge.length < 2) {
      toast.error("Please select at least 2 questions to merge");
      return;
    }

    // Get the selected requests
    const requestsToMerge = serviceRequests.filter(req => 
      selectedQuestionsToMerge.includes(req.id)
    );

    // Combine all question details
    const mergedDetails = requestsToMerge
      .map((req, index) => `${index + 1}. ${req.details}`)
      .join('\n\n');

    // Use the earliest queue position
    const earliestRequest = requestsToMerge.reduce((prev, current) => 
      (prev.queuePosition || 999) < (current.queuePosition || 999) ? prev : current
    );

    // Create new merged request
    const mergedRequest: ServiceRequest = {
      id: serviceRequests.length + 1,
      type: "questions",
      description: "Asked multiple questions",
      timestamp: new Date(),
      status: "pending",
      details: mergedDetails,
      estimatedTime: earliestRequest.estimatedTime,
      queuePosition: earliestRequest.queuePosition
    };

    // Remove old requests and add merged one
    setServiceRequests(prev => [
      ...prev.filter(req => !selectedQuestionsToMerge.includes(req.id)),
      mergedRequest
    ]);

    // Reset merge mode and selection
    setIsMergeMode(false);
    setSelectedQuestionsToMerge([]);

    toast.success("Questions merged", {
      description: `${selectedQuestionsToMerge.length} questions have been merged into one request.`,
    });
  };

  const renderModalContent = () => {
    const currentRequests = getServiceRequests(selectedService!);
    
    switch (selectedService) {
      case "cleaning":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Housekeeping Request</DialogTitle>
              <DialogDescription>
                Select the type of cleaning service you need
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Existing Requests */}
              {currentRequests.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium mb-2">Your Requests</h4>
                  {currentRequests.slice().reverse().map(req => (
                    <ServiceRequestCard
                      key={req.id}
                      request={req}
                      onCancel={handleCancelRequest}
                      formatTime={formatTime}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
              
              <div className="space-y-3">
                <Label>Cleaning Type</Label>
                <RadioGroup value={cleaningType} onValueChange={setCleaningType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="font-normal">Full cleaning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refresh" id="refresh" />
                    <Label htmlFor="refresh" className="font-normal">Quick refresh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="towels" id="towels" />
                    <Label htmlFor="towels" className="font-normal">Towels only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bedding" id="bedding" />
                    <Label htmlFor="bedding" className="font-normal">Change bedding</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cleaning-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="cleaning-notes"
                  placeholder="Any specific requests or areas to focus on..."
                  value={cleaningNotes}
                  onChange={(e) => setCleaningNotes(e.target.value)}
                  className={isMobile ? "min-h-24 text-base" : "min-h-20"}
                />
              </div>
              <Button onClick={handleSubmitCleaning} className="w-full" size={isMobile ? "lg" : "default"}>
                Submit Request
              </Button>
            </div>
          </>
        );

      case "food":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Room Service Menu</DialogTitle>
              <DialogDescription>
                Browse our menu and add items to your order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Existing Requests */}
              {currentRequests.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium mb-2">Your Orders</h4>
                  {currentRequests.slice().reverse().map(req => (
                    <ServiceRequestCard
                      key={req.id}
                      request={req}
                      onCancel={handleCancelRequest}
                      formatTime={formatTime}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
              
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {menuCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="max-h-[50vh] overflow-y-auto space-y-3">
                {menuItems[activeCategory as keyof typeof menuItems].map(item => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        <p className="font-semibold text-orange-600 mt-2">€{item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Add/Remove Buttons */}
                      <div className="flex items-center gap-2">
                        {selectedMenuItems[item.id] ? (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeMenuItem(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{selectedMenuItems[item.id]}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => addMenuItem(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addMenuItem(item.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              {getTotalItems() > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Your Order</span>
                    </div>
                    <Badge className="bg-orange-600">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-semibold text-orange-900">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSubmitMenuOrder} 
                className="w-full" 
                size={isMobile ? "lg" : "default"}
                disabled={getTotalItems() === 0}
              >
                Place Order
              </Button>
            </div>
          </>
        );

      case "doNotDisturb":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Do Not Disturb</DialogTitle>
              <DialogDescription>
                Set quiet hours for your room
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <DoorClosed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Do Not Disturb Mode</p>
                    <p className="text-xs text-muted-foreground">
                      {doNotDisturbEnabled ? "Currently active" : "Currently inactive"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={doNotDisturbEnabled} 
                  onCheckedChange={setDoNotDisturbEnabled}
                />
              </div>
              
              {doNotDisturbEnabled && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Active Hours</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">From</Label>
                      <input
                        id="start-time"
                        type="time"
                        value={doNotDisturbStart}
                        onChange={(e) => setDoNotDisturbStart(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Until</Label>
                      <input
                        id="end-time"
                        type="time"
                        value={doNotDisturbEnd}
                        onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <Button onClick={handleSubmitDoNotDisturb} className="w-full" size={isMobile ? "lg" : "default"}>
                {doNotDisturbEnabled ? "Save Settings" : "Activate"}
              </Button>
            </div>
          </>
        );

      case "questions":
        const pendingQuestions = currentRequests.filter(req => req.status === "pending");
        return (
          <>
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Our concierge team is here to help
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Existing Requests */}
              {currentRequests.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Your Questions</h4>
                    {pendingQuestions.length > 1 && !isMergeMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMergeMode(true)}
                      >
                        <Merge className="h-4 w-4 mr-1" />
                        Merge
                      </Button>
                    )}
                    {isMergeMode && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsMergeMode(false);
                            setSelectedQuestionsToMerge([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleMergeQuestions}
                          disabled={selectedQuestionsToMerge.length < 2}
                        >
                          Merge ({selectedQuestionsToMerge.length})
                        </Button>
                      </div>
                    )}
                  </div>
                  {currentRequests.slice().reverse().map(req => (
                    <ServiceRequestCard
                      key={req.id}
                      request={req}
                      onCancel={handleCancelRequest}
                      formatTime={formatTime}
                      getStatusColor={getStatusColor}
                      showCheckbox={isMergeMode && req.status === "pending"}
                      isSelected={selectedQuestionsToMerge.includes(req.id)}
                      onToggleSelection={toggleQuestionSelection}
                    />
                  ))}
                </div>
              )}
              
              {!isMergeMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="question">Your Question</Label>
                    <Textarea
                      id="question"
                      placeholder="E.g., What time is breakfast served? Do you have laundry service?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className={isMobile ? "min-h-32 text-base" : "min-h-24"}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitQuestion} 
                    className="w-full" 
                    size={isMobile ? "lg" : "default"}
                    disabled={!question.trim()}
                  >
                    Send Question
                  </Button>
                </>
              )}
            </div>
          </>
        );

      case "problem":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Report a Problem</DialogTitle>
              <DialogDescription>
                Let us know about any issues in your room
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Existing Requests */}
              {currentRequests.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium mb-2">Your Reports</h4>
                  {currentRequests.slice().reverse().map(req => (
                    <div key={req.id} className="flex items-start gap-2 p-2 bg-background rounded border">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{req.description}</p>
                            {req.details && <p className="text-xs text-muted-foreground mt-1">{req.details}</p>}
                            <p className="text-xs text-muted-foreground mt-1">{formatTime(req.timestamp)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                            {req.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelRequest(req.id);
                                }}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3">
                <Label>Problem Type</Label>
                <RadioGroup value={problemType} onValueChange={setProblemType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintenance" id="maintenance" />
                    <Label htmlFor="maintenance" className="font-normal">Maintenance issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cleanliness" id="cleanliness" />
                    <Label htmlFor="cleanliness" className="font-normal">Cleanliness concern</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amenities" id="amenities" />
                    <Label htmlFor="amenities" className="font-normal">Missing amenities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noise" id="noise" />
                    <Label htmlFor="noise" className="font-normal">Noise complaint</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other-problem" id="other-problem" />
                    <Label htmlFor="other-problem" className="font-normal">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem-description">Description</Label>
                <Textarea
                  id="problem-description"
                  placeholder="Please describe the issue in detail..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className={isMobile ? "min-h-32 text-base" : "min-h-24"}
                />
              </div>
              <Button 
                onClick={handleSubmitProblem} 
                className="w-full" 
                size={isMobile ? "lg" : "default"}
                disabled={!problemDescription.trim()}
              >
                Submit Report
              </Button>
            </div>
          </>
        );

      case "other":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Other Services</DialogTitle>
              <DialogDescription>
                Request any other service you need
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Existing Requests */}
              {currentRequests.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium mb-2">Your Requests</h4>
                  {currentRequests.slice().reverse().map(req => (
                    <div key={req.id} className="flex items-start gap-2 p-2 bg-background rounded border">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{req.description}</p>
                            {req.details && <p className="text-xs text-muted-foreground mt-1">{req.details}</p>}
                            <p className="text-xs text-muted-foreground mt-1">{formatTime(req.timestamp)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                            {req.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelRequest(req.id);
                                }}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="other-request">Service Request</Label>
                <Textarea
                  id="other-request"
                  placeholder="E.g., Extra pillows, iron and ironing board, wake-up call..."
                  value={otherRequest}
                  onChange={(e) => setOtherRequest(e.target.value)}
                  className={isMobile ? "min-h-32 text-base" : "min-h-24"}
                />
              </div>
              <Button 
                onClick={handleSubmitOther} 
                className="w-full" 
                size={isMobile ? "lg" : "default"}
                disabled={!otherRequest.trim()}
              >
                Submit Request
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Room Services"
        subtitle={`Room ${guestInfo.roomNumber}`}
        onBack={onBack}
        notificationCount={serviceRequests.filter(req => req.status !== "completed").length}
        onNotificationClick={() => setIsNotificationModalOpen(true)}
        onProfileClick={onProfileClick}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-semibold mb-2">Room Services</h1>
          <p className="text-muted-foreground">
            Access all services for Room {guestInfo.roomNumber}
          </p>
        </div>

        {/* Room Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Room Details Card */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">Room Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{roomInfo.numberOfAdults} {roomInfo.numberOfAdults === 1 ? 'Adult' : 'Adults'}, {roomInfo.numberOfChildren} {roomInfo.numberOfChildren === 1 ? 'Child' : 'Children'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Info className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{roomInfo.plan}</p>
                      <Badge variant="secondary" className="text-xs">{roomInfo.plan}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Charge to Room</p>
                    <p className="font-medium">{roomInfo.canChargeToRoom ? 'Enabled' : 'Not Available'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout & Charges Card */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">Checkout & Charges</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Check-out Date</p>
                    <p className="font-medium">{roomInfo.checkOutDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Check-out Time</p>
                    <p className="font-medium">{roomInfo.checkOutTime}</p>
                  </div>
                </div>
                
                {/* Late Checkout Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsLateCheckoutModalOpen(true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Request Late Checkout
                  </Button>
                </div>
                
                {roomInfo.canChargeToRoom && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="p-2 rounded-lg bg-red-50">
                      <CreditCard className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Room Charges</p>
                      <p className="font-medium">€{roomInfo.totalCharges.toFixed(2)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsChargesModalOpen(true)}
                    >
                      Details
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Kids Club Card - Only show if there are children */}
          {children.length > 0 && (
            <Card
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setIsKidsClubModalOpen(true)}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="bg-pink-50 w-12 h-12 rounded-lg flex items-center justify-center text-pink-600">
                    <Baby className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Kids Club</h3>
                    <p className="text-sm text-muted-foreground">
                      Enroll your children in our supervised Kids Club
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {services.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 relative"
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className={`${service.bgColor} w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                    {service.icon}
                    {getServiceRequestCount(service.id) > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500 text-white hover:bg-red-600">{getServiceRequestCount(service.id)}</Badge>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-md"}`}>
          {renderModalContent()}
        </DialogContent>
      </Dialog>

      {/* Charges Details Modal */}
      <Dialog open={isChargesModalOpen} onOpenChange={setIsChargesModalOpen}>
        <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-lg"}`}>
          <DialogHeader>
            <DialogTitle>Room Charges</DialogTitle>
            <DialogDescription>
              Detailed breakdown of all charges to your room
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
            {charges.map((charge, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{charge.date}</Badge>
                  </div>
                  <p className="font-medium">{charge.description}</p>
                </div>
                <p className="font-medium">€{charge.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Total Charges</p>
              <p className="text-xl font-semibold">€{roomInfo.totalCharges.toFixed(2)}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              All charges will be settled at checkout. If you have any questions about these charges, please contact the front desk.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Late Checkout Modal */}
      <Dialog open={isLateCheckoutModalOpen} onOpenChange={setIsLateCheckoutModalOpen}>
        <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-md"}`}>
          <DialogHeader>
            <DialogTitle>Request Late Checkout</DialogTitle>
            <DialogDescription>
              Extend your stay and checkout later for an additional fee
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Current Checkout Info */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Checkout</span>
                <span className="font-medium">{roomInfo.checkOutTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Late Checkout Until</span>
                <span className="font-medium text-primary">{roomInfo.lateCheckoutTime}</span>
              </div>
            </div>

            {/* Price Information */}
            <div className="p-4 border rounded-lg bg-amber-50/50 border-amber-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <CreditCard className="h-5 w-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Additional Charge</p>
                  <p className="text-2xl font-semibold text-amber-900">€{roomInfo.lateCheckoutPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This charge will be added to your room bill
                  </p>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <Info className="h-4 w-4 inline mr-1" />
                Your request is subject to availability. We'll confirm via notification once processed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsLateCheckoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleLateCheckoutRequest}
                size={isMobile ? "lg" : "default"}
              >
                Request Late Checkout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kids Club Modal */}
      <Dialog open={isKidsClubModalOpen} onOpenChange={setIsKidsClubModalOpen}>
        <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-md"}`}>
          <DialogHeader>
            <DialogTitle>Kids Club Enrollment</DialogTitle>
            <DialogDescription>
              Enroll your children in our Kids Club for a fun and safe experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Current Enrollments */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium mb-2">Current Enrollments</h4>
              {children.map(child => (
                <div key={child.id} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{child.name} ({child.age} years)</span>
                  <Badge 
                    variant={child.enrolled ? "default" : "outline"} 
                    className={child.enrolled ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                  >
                    {child.enrolled ? "Enrolled" : "Not Enrolled"}
                  </Badge>
                </div>
              ))}
            </div>

            {/* New Enrollment Form */}
            <div className="p-4 border rounded-lg bg-amber-50/50 border-amber-200">
              <h4 className="font-medium mb-2">Enroll a New Child</h4>
              <div className="space-y-2">
                <Label htmlFor="new-child-name">Child's Name</Label>
                <Input
                  id="new-child-name"
                  placeholder="E.g., Emma"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="new-child-age">Child's Age</Label>
                <Input
                  id="new-child-age"
                  placeholder="E.g., 7"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <Button 
                className="w-full mt-2"
                onClick={handleKidsClubEnrollment}
                size={isMobile ? "lg" : "default"}
              >
                Enroll Child
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}