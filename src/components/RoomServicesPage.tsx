import { useState } from "react";
import { TopBar } from "./TopBar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { useIsMobile } from "./ui/use-mobile";
import { toast } from "sonner@2.0.3";
import { 
  Sparkles, 
  UtensilsCrossed, 
  DoorClosed, 
  HelpCircle, 
  AlertTriangle, 
  MessageSquare,
  Clock,
  ArrowLeft
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

export function RoomServicesPage({ onBack, guestInfo, onProfileClick }: RoomServicesPageProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Cleaning modal state
  const [cleaningType, setCleaningType] = useState<string>("full");
  const [cleaningNotes, setCleaningNotes] = useState("");

  // Food order modal state
  const [foodRequest, setFoodRequest] = useState("");

  // Do Not Disturb state
  const [doNotDisturbEnabled, setDoNotDisturbEnabled] = useState(false);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState("14:00");
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState("16:00");

  // Questions modal state
  const [question, setQuestion] = useState("");

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
    toast.success("Housekeeping request submitted", {
      description: `Your ${cleaningType} cleaning request has been sent.`,
    });
    handleCloseModal();
  };

  const handleSubmitFood = () => {
    toast.success("Room service order submitted", {
      description: "Your food order request has been sent to the kitchen.",
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
    toast.success("Question sent to concierge", {
      description: "We'll respond to your question shortly.",
    });
    handleCloseModal();
  };

  const handleSubmitProblem = () => {
    toast.success("Problem report submitted", {
      description: "Our maintenance team will address this shortly.",
    });
    handleCloseModal();
  };

  const handleSubmitOther = () => {
    toast.success("Service request submitted", {
      description: "We'll process your request shortly.",
    });
    handleCloseModal();
  };

  const renderModalContent = () => {
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
              <DialogTitle>Room Service Order</DialogTitle>
              <DialogDescription>
                Describe what you'd like to order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="food-request">Your Order</Label>
                <Textarea
                  id="food-request"
                  placeholder="E.g., Caesar salad, grilled salmon with vegetables, sparkling water..."
                  value={foodRequest}
                  onChange={(e) => setFoodRequest(e.target.value)}
                  className={isMobile ? "min-h-32 text-base" : "min-h-24"}
                />
                <p className="text-xs text-muted-foreground">
                  You can also call room service directly at extension 2301
                </p>
              </div>
              <Button 
                onClick={handleSubmitFood} 
                className="w-full" 
                size={isMobile ? "lg" : "default"}
                disabled={!foodRequest.trim()}
              >
                Send Order Request
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
        return (
          <>
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Our concierge team is here to help
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
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
        notificationCount={0}
        onNotificationClick={() => {}}
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className={`${service.bgColor} w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                    {service.icon}
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
    </div>
  );
}
