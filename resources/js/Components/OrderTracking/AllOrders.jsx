import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AllOrders({
  orders,
  currentPage,
  ordersPerPage,
  onOrderClick,
  onPageChange,
  formatDate,
  formatTime24Hour,
  formatDateTime,
  calculateTotalExpenses,
}) {
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <Card className="w-full max-w-5xl shadow-2xl rounded-2xl bg-white transform transition-all hover:scale-[1.01]">
      <CardContent className="p-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          All User Orders
        </h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No orders found
          </div>
        ) : (
          <>
            {/* Cards for small screens */}
            <div className="sm:hidden grid grid-cols-1 gap-6">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="cursor-pointer p-5 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                  onClick={() => onOrderClick(order)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order ARYAN{order.id}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    User: {order.user_name}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Ordered: {formatDate(order.created_at)}{" "}
                    {formatTime24Hour(order.created_at)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Delivered: {formatDateTime(order.delivered_date) || "N/A"}
                  </p>
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

            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      User ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Client
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Order Date
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Delivered Date
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Total
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Paid
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Pending
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Expenses
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm font-semibold text-gray-800">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors text-xs sm:text-sm border-b"
                      onClick={() => onOrderClick(order)}
                    >
                      <TableCell className="font-medium">ARYAN{order.id}</TableCell>
                      <TableCell className="font-medium">{order.user_id}</TableCell>
                      <TableCell>{order.user_name}</TableCell>
                      <TableCell>
                        {formatDate(order.created_at)}{" "}
                        {formatTime24Hour(order.created_at)}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(order.delivered_date) || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="text-gray-600" />
                          {order.total_amount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="text-gray-600" />
                          {order.paid_payment}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="text-gray-600" />
                          {order.pending_payment}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="text-gray-600" />
                          {calculateTotalExpenses(order.id)}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination className="mt-6">
              <PaginationContent className="flex flex-wrap justify-center gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="hover:bg-gray-200 rounded-lg"
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(orders.length / ordersPerPage) },
                  (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => onPageChange(i + 1)}
                        isActive={currentPage === i + 1}
                        className={cn(
                          "px-3 py-1 rounded-lg",
                          currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200"
                        )}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(orders.length / ordersPerPage)
                    }
                    className="hover:bg-gray-200 rounded-lg"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}