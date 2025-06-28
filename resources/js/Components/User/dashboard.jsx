import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ClipboardList, User, BarChart } from "lucide-react";

const stats = [
  {
    title: "Orders",
    value: "$35,485",
    percentage: "+2.8%",
    icon: <ClipboardList className="h-5 w-5" />, // Order Icon
    compared: "$25,450 last year",
    up: true,
    bg: "bg-green-600 text-white",
  },
  {
    title: "Avg. Order Amount",
    value: "$8,562",
    percentage: "-2.8%",
    icon: <BarChart className="h-5 w-5" />, // Avg Order Icon
    compared: "$6,232 last year",
    up: false,
    bg: "bg-gray-100",
  },
  {
    title: "Unique Customers",
    value: "15,235",
    percentage: "+2.8%",
    icon: <User className="h-5 w-5" />, // Customers Icon
    compared: "12,840 last year",
    up: true,
    bg: "bg-gray-100",
  },
  {
    title: "Net Sales",
    value: "$9,584",
    percentage: "+3.8%",
    icon: <BarChart className="h-5 w-5" />, // Sales Icon
    compared: "$8,569 last year",
    up: true,
    bg: "bg-gray-100",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-4 rounded-lg shadow-md ${stat.bg}`}>
          <CardContent className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              {stat.icon}
              <span>{stat.title}</span>
            </div>
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="flex items-center text-sm">
              <span className={stat.up ? "text-green-500" : "text-red-500"}>
                {stat.percentage}
              </span>
              {stat.up ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-xs text-gray-500">Compared to ({stat.compared})</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
