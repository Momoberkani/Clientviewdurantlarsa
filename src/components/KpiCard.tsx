import { Card, CardContent } from "./ui/card";

interface KpiCardProps {
  title: string;
  value: number;
  status: "Available" | "Occupied" | "Available soon";
  onClick?: () => void;
}

export function KpiCard({ title, value, status, onClick }: KpiCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-600";
      case "Occupied":
        return "text-red-600";
      case "Available soon":
        return "text-orange-600";
      default:
        return "text-muted-foreground";
    }
  };

  const isClickable = status === "Available soon" && onClick;

  return (
    <Card 
      className={`w-full ${isClickable ? "cursor-pointer hover:bg-accent transition-colors touch-manipulation" : ""}`}
      onClick={isClickable ? onClick : undefined}
    >
      <CardContent className="p-4 text-center min-h-[120px] flex flex-col justify-center">
        <h3 className="text-sm text-muted-foreground mb-2 truncate">{title}</h3>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="text-center">
          <p className={`text-sm ${getStatusColor(status)} truncate`}>
            {status}
          </p>
          {isClickable && (
            <p className="text-xs opacity-70 mt-1">
              (tap to view)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}