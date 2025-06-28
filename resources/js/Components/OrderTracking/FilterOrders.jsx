import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function FilterOrders({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  deliveredStartDate, // New prop for delivered start date
  setDeliveredStartDate, // New prop for setting delivered start date
  deliveredEndDate, // New prop for delivered end date
  setDeliveredEndDate, // New prop for setting delivered end date
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  exportToExcel,
  filteredOrders,
}) {
  return (
    <Card className="w-full max-w-5xl shadow-2xl rounded-2xl bg-white mb-8 transform transition-all hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Filter Orders
          </h2>
          <Button
            onClick={exportToExcel}
            disabled={filteredOrders.length === 0}
            className={cn(
              "bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md",
              filteredOrders.length === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Export to Excel
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700"
            >
              Ordered Start Date
            </Label>
            <div className="relative mt-1">
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700"
            >
              Ordered End Date
            </Label>
            <div className="relative mt-1">
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label
              htmlFor="deliveredStartDate"
              className="text-sm font-medium text-gray-700"
            >
              Delivered Start Date
            </Label>
            <div className="relative mt-1">
              <Input
                id="deliveredStartDate"
                type="date"
                value={deliveredStartDate}
                onChange={(e) => setDeliveredStartDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label
              htmlFor="deliveredEndDate"
              className="text-sm font-medium text-gray-700"
            >
              Delivered End Date
            </Label>
            <div className="relative mt-1">
              <Input
                id="deliveredEndDate"
                type="date"
                value={deliveredEndDate}
                onChange={(e) => setDeliveredEndDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status
            </Label>
            <Select
              onValueChange={setStatusFilter}
              value={statusFilter}
              className="mt-1"
            >
              <SelectTrigger
                id="status"
                className="w-full border-gray-300 rounded-lg shadow-sm"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <Label
              htmlFor="search"
              className="text-sm font-medium text-gray-700"
            >
              Search
            </Label>
            <div className="relative mt-1">
              <Input
                id="search"
                type="text"
                placeholder="Search by Order ID or User Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}