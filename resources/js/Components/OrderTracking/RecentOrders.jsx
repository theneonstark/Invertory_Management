import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecentOrders({
  orders,
  onOrderClick,
  formatDate,
  formatTime24Hour,
  formatDateTime,
  calculateTotalExpenses,
}) {
  return (
    <Card className="w-full max-w-5xl shadow-2xl rounded-2xl bg-white mb-8 transform transition-all hover:scale-[1.01]">
      <CardContent className="p-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          Recent Orders (Top 9)
        </h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No orders found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="cursor-pointer p-5 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                onClick={() => onOrderClick(order)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ARYAN{order.id}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Client: {order.user_name}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Ordered: {formatDate(order.created_at)}{" "}
                  {formatTime24Hour(order.created_at)}
                </p>
                {order.delivered_date && (
                  <p className="text-gray-600 text-sm mt-1">
                    Delivered: {formatDateTime(order.delivered_date)}
                  </p>
                )}
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span>Booking:</span>
                    <div className="flex items-center font-medium">
                      <IndianRupee size={14} className="mr-1 text-gray-600" />
                      <span>{order.total_amount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span>Paid:</span>
                    <div className="flex items-center font-medium">
                      <IndianRupee size={14} className="mr-1 text-gray-600" />
                      <span>{order.paid_payment}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span>Pending:</span>
                    <div className="flex items-center font-medium">
                      <IndianRupee size={14} className="mr-1 text-gray-600" />
                      <span>{order.pending_payment}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span>Total Expenses:</span>
                    <div className="flex items-center font-medium">
                      <IndianRupee size={14} className="mr-1 text-gray-600" />
                      <span>{calculateTotalExpenses(order.id)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Badge
                      className={cn(
                        "px-3 py-1 text-xs font-semibold text-white rounded-full shadow-sm",
                        order.pending_payment !== "0.00"
                          ? "bg-red-600"
                          : "bg-green-600"
                      )}
                    >
                      {order.pending_payment !== "0.00" ? "Pending" : "Paid"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}