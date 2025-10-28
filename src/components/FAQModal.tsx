import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useIsMobile } from "./ui/use-mobile";
import { HelpCircle, BookOpen, ShoppingCart, Phone, MapPin, Clock } from "lucide-react";

interface FAQModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FAQModal({ open, onOpenChange }: FAQModalProps) {
  const isMobile = useIsMobile();

  const faqItems = [
    {
      id: "booking-sunbed",
      question: "How do I book a sunbed?",
      icon: <MapPin className="h-4 w-4 text-primary" />,
      answer: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Booking a sunbed is easy! Follow these steps:
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
            <li>Check the availability in the "Sunbed Status" section</li>
            <li>Tap the green "Book a Sunbed" button</li>
            <li>Browse available sunbeds by zone (Pool Area, Beach Front, Garden View)</li>
            <li>Use the search function to find specific sunbeds</li>
            <li>Select up to your quota limit (multiple selection allowed)</li>
            <li>Confirm your booking</li>
          </ol>
          <p className="text-xs text-muted-foreground bg-accent/50 p-2 rounded">
            💡 Tip: You can book multiple sunbeds at once if your quota allows it!
          </p>
        </div>
      )
    },
    {
      id: "ordering-food",
      question: "How can I order food and drinks?",
      icon: <ShoppingCart className="h-4 w-4 text-primary" />,
      answer: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ordering is simple and convenient:
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
            <li>Tap "See the drinks/food" button</li>
            <li>Browse the menu tabs (Drinks & Food)</li>
            <li>Tap "Place an Order" to start ordering</li>
            <li>Select items and adjust quantities</li>
            <li>Review your order and choose payment method:</li>
            <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
              <li>Credit/Debit Card</li>
              <li>Cash (pay on delivery)</li>
              <li>Charge to Room (added to your hotel bill)</li>
            </ul>
            <li>Confirm your order</li>
          </ol>
        </div>
      )
    },
    {
      id: "waiter-service",
      question: "How do I call a waiter?",
      icon: <Phone className="h-4 w-4 text-primary" />,
      answer: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get assistance quickly with our waiter service:
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
            <li>Tap the blue "Call a Waiter" button</li>
            <li>Select the type of service you need:</li>
            <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
              <li>Towel service</li>
              <li>Place an order</li>
              <li>Other services (with custom message)</li>
            </ul>
            <li>Submit your request</li>
            <li>Track the request status in your notifications</li>
          </ol>
          <p className="text-xs text-muted-foreground bg-accent/50 p-2 rounded">
            📱 Tip: You'll get a notification when your request is completed!
          </p>
        </div>
      )
    },
    {
      id: "booking-management",
      question: "How do I manage my sunbed bookings?",
      icon: <Clock className="h-4 w-4 text-primary" />,
      answer: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Easily manage your active bookings:
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
            <li><strong>View Active Bookings:</strong> See all your current reservations with remaining time</li>
            <li><strong>Extend Booking:</strong> Add 30 minutes to your current reservation</li>
            <li><strong>Release Sunbed:</strong> End your booking early to free up the sunbed</li>
            <li><strong>Call Waiter:</strong> Request services directly for your specific sunbed</li>
          </ul>
          <p className="text-xs text-muted-foreground bg-accent/50 p-2 rounded">
            ⏱️ Tip: Keep an eye on your booking timer to avoid missing your sunbed time!
          </p>
        </div>
      )
    },
    {
      id: "availability",
      question: "What do the availability statuses mean?",
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      answer: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Understanding sunbed availability:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded">
              <div className="w-3 h-3 bg-green-600 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Available</p>
                <p className="text-xs text-green-700 dark:text-green-400">Ready to book now</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded">
              <div className="w-3 h-3 bg-red-600 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">Occupied</p>
                <p className="text-xs text-red-700 dark:text-red-400">Currently in use</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded cursor-pointer">
              <div className="w-3 h-3 bg-orange-600 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Coming Soon</p>
                <p className="text-xs text-orange-700 dark:text-orange-400">Will be available soon - tap to see details</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[85vh]" : "sm:max-w-2xl h-[80vh]"} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </DialogTitle>
          <DialogDescription>
            Find answers to common questions about using the sunbed booking system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                <AccordionTrigger className={`hover:no-underline ${isMobile ? "py-4" : "py-3"}`}>
                  <div className="flex items-center gap-3 text-left">
                    {item.icon}
                    <span className={`${isMobile ? "text-base" : "text-sm"} font-medium`}>
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={`${isMobile ? "pb-4" : "pb-3"}`}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}