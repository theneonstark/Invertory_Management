import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IndianRupee, Calendar, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { UpdateOrders } from "@/lib/Apis";
import { toast } from "react-toastify";
import axios from "axios";
import * as XLSX from "xlsx";

const api = axios.create({
  baseURL: "", // Adjust to your Laravel API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default function OrderTracking({ userorders, onUpdateOrder }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentLogs, setShowPaymentLogs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const ordersPerPage = 10;

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses");
        if (response.data.success) {
          setExpenses(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses");
      }
    };
    fetchExpenses();
  }, []);

  const handleOrderClick = (order) => {
    const initialEditedOrder = {
      ...order,
      created_at_date: order.created_at
        ? new Date(order.created_at).toISOString().split("T")[0]
        : "",
      created_at_time: order.created_at
        ? new Date(order.created_at)
            .toLocaleTimeString("en-US", { hour12: false })
            .slice(0, 5)
        : "12:00",
      delivered_date_date: order.delivered_date
        ? new Date(order.delivered_date).toISOString().split("T")[0]
        : "",
      delivered_date_time: order.delivered_date
        ? new Date(order.delivered_date)
            .toLocaleTimeString("en-US", { hour12: false })
            .slice(0, 5)
        : "12:00",
      pickup_time_date: order.pickup_time
        ? new Date(order.pickup_time).toISOString().split("T")[0]
        : "",
      pickup_time_time: order.pickup_time
        ? new Date(order.pickup_time)
            .toLocaleTimeString("en-US", { hour12: false })
            .slice(0, 5)
        : "12:00",
    };
    setSelectedOrder(order);
    setEditedOrder(initialEditedOrder);
    setShowPaymentLogs(false);
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowPaymentLogs(false);
    setIsEditing(false);
  };

  const togglePaymentLogs = () => {
    setShowPaymentLogs(!showPaymentLogs);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const toMySQLTimestamp = (date, time) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);

    const dateObj = new Date(date);
    dateObj.setHours(hour, minute, 0, 0);

    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")} ${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(2, "0")}:00`;
  };

  const handleInputChange = (field, value) => {
    setEditedOrder((prev) => {
      const updatedOrder = { ...prev, [field]: value };
      if (field === "total_amount" || field === "paid_payment") {
        const total = parseFloat(updatedOrder.total_amount) || 0;
        const paid = parseFloat(updatedOrder.paid_payment) || 0;
        updatedOrder.pending_payment = (total - paid).toFixed(2);
      }
      return updatedOrder;
    });
  };

  const handleSaveChanges = async () => {
    try {
      const orderData = {
        user_email: editedOrder.user_email,
        user_phone: editedOrder.user_phone,
        user_address: editedOrder.user_address,
        user_city: editedOrder.user_city,
        user_zip: editedOrder.user_zip,
        billing_number: editedOrder.billing_number,
        created_at: toMySQLTimestamp(
          editedOrder.created_at_date,
          editedOrder.created_at_time
        ),
        shipping_address: editedOrder.shipping_address,
        delivered_date: toMySQLTimestamp(
          editedOrder.delivered_date_date,
          editedOrder.delivered_date_time
        ),
        pickup_time: toMySQLTimestamp(
          editedOrder.pickup_time_date,
          editedOrder.pickup_time_time
        ),
        total_amount: parseFloat(editedOrder.total_amount),
        paid_payment: parseFloat(editedOrder.paid_payment),
        pending_payment: parseFloat(editedOrder.pending_payment),
      };

      if (
        orderData.delivered_date &&
        orderData.pickup_time &&
        orderData.delivered_date > orderData.pickup_time
      ) {
        toast.error("Delivered date cannot be before pickup time");
        return;
      }

      const response = await UpdateOrders(editedOrder.id, orderData);

      if (response) {
        if (onUpdateOrder) {
          onUpdateOrder(response.data);
        }
        setSelectedOrder(response.data);
        setIsEditing(false);
        toast.success("Order updated successfully");
      } else {
        throw new Error(response.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error in handleSaveChanges:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        toast.error(`Validation failed:\n${errorMessages}`);
      } else {
        toast.error(`Failed to update order: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime24Hour = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return `${formatDate(dateString)} ${formatTime24Hour(dateString)}`;
  };

  const calculateTotalExpenses = (orderId) => {
    const orderExpenses = expenses.filter(
      (exp) => exp.order_id.toString() === orderId.toString()
    );
    return orderExpenses
      .reduce((total, exp) => {
        if (Array.isArray(exp.expenses)) {
          return (
            total +
            exp.expenses.reduce(
              (sum, item) => sum + parseFloat(item.amount || 0),
              0
            )
          );
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const getOrderExpenses = (orderId) => {
    return expenses.filter(
      (exp) => exp.order_id.toString() === orderId.toString()
    );
  };

  const filteredOrders = useMemo(() => {
    return userorders
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((order) => {
        const orderDate = new Date(order.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const dateFilter =
          (!start || orderDate >= start) && (!end || orderDate <= end);
        const statusFilterCheck =
          statusFilter === "all" ||
          (statusFilter === "pending" && order.pending_payment !== "0.00") ||
          (statusFilter === "paid" && order.pending_payment === "0.00");

        const searchFilter =
          searchQuery === "" ||
          order.id.toString().includes(searchQuery) ||
          order.user_name.toLowerCase().includes(searchQuery.toLowerCase());

        return dateFilter && statusFilterCheck && searchFilter;
      });
  }, [userorders, startDate, endDate, statusFilter, searchQuery]);

  const recentOrders = filteredOrders.slice(0, 9);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      "User Name": order.user_name,
      "Order Date": formatDateTime(order.created_at),
      "Delivered Date": formatDateTime(order.delivered_date) || "N/A",
      "Total Amount": parseFloat(order.total_amount).toFixed(2),
      "Paid Payment": parseFloat(order.paid_payment).toFixed(2),
      "Pending Payment": parseFloat(order.pending_payment).toFixed(2),
      "Total Expenses": calculateTotalExpenses(order.id),
      Status: order.pending_payment !== "0.00" ? "Pending" : "Paid",
      "Billing Number": order.billing_number || "N/A",
      "User Email": order.user_email,
      "User Phone": order.user_phone,
      "User Address": order.user_address,
      "User City": order.user_city,
      "User Zip": order.user_zip,
      "Shipping Address": order.shipping_address,
      "Pickup Date": formatDateTime(order.pickup_time) || "N/A",
      Products: order.products
        .map((p) => `${p.product_name} (Qty: ${p.quantity}, Price: ${p.product_price})`)
        .join("; "),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Define column widths for better readability
    worksheet["!cols"] = [
      { wch: 10 }, // Order ID
      { wch: 20 }, // User Name
      { wch: 25 }, // Order Date
      { wch: 25 }, // Delivered Date
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Paid Payment
      { wch: 15 }, // Pending Payment
      { wch: 15 }, // Total Expenses
      { wch: 10 }, // Status
      { wch: 15 }, // Billing Number
      { wch: 25 }, // User Email
      { wch: 15 }, // User Phone
      { wch: 30 }, // User Address
      { wch: 15 }, // User City
      { wch: 10 }, // User Zip
      { wch: 30 }, // Shipping Address
      { wch: 25 }, // Pickup Date
      { wch: 50 }, // Products
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Generate and download Excel file
    XLSX.writeFile(
      workbook,
      `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Filter Orders */}
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
                Start Date
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
                End Date
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

      {/* Recent Orders */}
      <Card className="w-full max-w-5xl shadow-2xl rounded-2xl bg-white mb-8 transform transition-all hover:scale-[1.01]">
        <CardContent className="p-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
            Recent Orders (Top 9)
          </h2>
          {recentOrders.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No orders found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="cursor-pointer p-5 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                  onClick={() => handleOrderClick(order)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #ARYAN{order.id}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    User: {order.user_name}
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

      {/* All Orders Section */}
      <Card className="w-full max-w-5xl shadow-2xl rounded-2xl bg-white transform transition-all hover:scale-[1.01]">
        <CardContent className="p-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
            All User Orders
          </h2>
          {filteredOrders.length === 0 ? (
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
                    onClick={() => handleOrderClick(order)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #ARYAN{order.id}
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
                        User
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
                        onClick={() => handleOrderClick(order)}
                      >
                        <TableCell className="font-medium">{order.id}</TableCell>
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
                            {order.pending_payment !== "0.00"
                              ? "Pending"
                              : "Paid"}
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
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="hover:bg-gray-200 rounded-lg"
                    />
                  </PaginationItem>
                  {Array.from(
                    {
                      length: Math.ceil(filteredOrders.length / ordersPerPage),
                    },
                    (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => paginate(i + 1)}
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
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredOrders.length / ordersPerPage)
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
          <Card className="w-full max-w-lg sm:max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Order Details
                </h2>
                <Button
                  onClick={handleEditToggle}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
                >
                  {isEditing ? "Cancel Edit" : "Edit Order"}
                </Button>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-700">
                {isEditing ? (
                  <>
                    <div>
                      <Label>ID:</Label>
                      <Input value={editedOrder.id} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label>Billing Number:</Label>
                      <Input
                        value={editedOrder.billing_number || ""}
                        onChange={(e) =>
                          handleInputChange("billing_number", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>User Name:</Label>
                      <Input
                        value={editedOrder.user_name}
                        disabled
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Order Date:</Label>
                      <div className="mt-1 flex flex-col gap-2">
                        <Input
                          type="date"
                          value={editedOrder.created_at_date}
                          onChange={(e) =>
                            handleInputChange("created_at_date", e.target.value)
                          }
                          className="w-full border-gray-300 rounded-lg shadow-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            value={editedOrder.created_at_time}
                            onChange={(e) =>
                              handleInputChange(
                                "created_at_time",
                                e.target.value
                              )
                            }
                            className="flex-1 border-gray-300 rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>User Email:</Label>
                      <Input
                        value={editedOrder.user_email}
                        onChange={(e) =>
                          handleInputChange("user_email", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>User Phone:</Label>
                      <Input
                        value={editedOrder.user_phone}
                        onChange={(e) =>
                          handleInputChange("user_phone", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>User Address:</Label>
                      <Input
                        value={editedOrder.user_address}
                        onChange={(e) =>
                          handleInputChange("user_address", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>User City:</Label>
                      <Input
                        value={editedOrder.user_city}
                        onChange={(e) =>
                          handleInputChange("user_city", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>User Zip:</Label>
                      <Input
                        value={editedOrder.user_zip}
                        onChange={(e) =>
                          handleInputChange("user_zip", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Shipping Address:</Label>
                      <Input
                        value={editedOrder.shipping_address}
                        onChange={(e) =>
                          handleInputChange("shipping_address", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Delivered Date:</Label>
                      <div className="mt-1 flex flex-col gap-2">
                        <Input
                          type="date"
                          value={editedOrder.delivered_date_date}
                          onChange={(e) =>
                            handleInputChange(
                              "delivered_date_date",
                              e.target.value
                            )
                          }
                          className="w-full border-gray-300 rounded-lg shadow-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            value={editedOrder.delivered_date_time}
                            onChange={(e) =>
                              handleInputChange(
                                "delivered_date_time",
                                e.target.value
                              )
                            }
                            className="flex-1 border-gray-300 rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Pickup Date:</Label>
                      <div className="mt-1 flex flex-col gap-2">
                        <Input
                          type="date"
                          value={editedOrder.pickup_time_date}
                          onChange={(e) =>
                            handleInputChange("pickup_time_date", e.target.value)
                          }
                          className="w-full border-gray-300 rounded-lg shadow-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            value={editedOrder.pickup_time_time}
                            onChange={(e) =>
                              handleInputChange(
                                "pickup_time_time",
                                e.target.value
                              )
                            }
                            className="flex-1 border-gray-300 rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Total Amount:</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editedOrder.total_amount}
                        onChange={(e) =>
                          handleInputChange("total_amount", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Paid Payment:</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editedOrder.paid_payment}
                        onChange={(e) =>
                          handleInputChange("paid_payment", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Pending Payment:</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editedOrder.pending_payment}
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Billing No:</strong> {selectedOrder.billing_number}
                    </p>
                    <p>
                      <strong>User Name:</strong> {selectedOrder.user_name}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {formatDate(selectedOrder.created_at)}{" "}
                      {formatTime24Hour(selectedOrder.created_at)}
                    </p>
                    <p>
                      <strong>User Email:</strong> {selectedOrder.user_email}
                    </p>
                    <p>
                      <strong>User Phone:</strong> {selectedOrder.user_phone}
                    </p>
                    <p>
                      <strong>User Address:</strong> {selectedOrder.user_address}
                    </p>
                    <p>
                      <strong>User City:</strong> {selectedOrder.user_city}
                    </p>
                    <p>
                      <strong>User Zip:</strong> {selectedOrder.user_zip}
                    </p>
                    <p className="text-cyan-700">
                      <strong>Shipping Add:</strong>{" "}
                      {selectedOrder.shipping_address}
                    </p>
                    <p>
                      <strong>Delivered Date:</strong>{" "}
                      {formatDateTime(selectedOrder.delivered_date)}
                    </p>
                    <p>
                      <strong>Pickup Date:</strong>{" "}
                      {formatDateTime(selectedOrder.pickup_time)}
                    </p>
                    <p>
                      <strong>Updated At:</strong>{" "}
                      {formatDate(selectedOrder.updated_at)}{" "}
                      {formatTime24Hour(selectedOrder.updated_at)}
                    </p>
                    <div className="flex items-center text-yellow-600 font-bold">
                      <strong>Total Amount:</strong>
                      <IndianRupee size={16} className="mx-2" />
                      <span>{selectedOrder.total_amount}</span>
                    </div>
                    <div className="flex items-center text-green-400 font-bold">
                      <strong>Paid Payment:</strong>
                      <IndianRupee size={16} className="mx-2" />
                      <span>{selectedOrder.paid_payment}</span>
                    </div>
                    <div className="flex items-center text-red-400 font-bold">
                      <strong>Pending Payment:</strong>
                      <IndianRupee size={16} className="mx-2" />
                      <span>{selectedOrder.pending_payment}</span>
                    </div>
                    <div className="flex items-center">
                      <strong>Total Expenses:</strong>
                      <IndianRupee size={16} className="mx-2" />
                      <span>{calculateTotalExpenses(selectedOrder.id)}</span>
                    </div>
                    <p>
                      <strong>Products:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {selectedOrder.products.map((product, index) => (
                        <li key={index}>
                          <strong>Name:</strong> {product.product_name},{" "}
                          <strong>Qty:</strong> {product.quantity},{" "}
                          <strong>Price:</strong>{" "}
                          <IndianRupee size={14} className="inline" />
                          {product.product_price}
                        </li>
                      ))}
                    </ul>

                    {/* Expenses Section */}
                    {getOrderExpenses(selectedOrder.id).length > 0 && (
                      <>
                        <p className="font-semibold mt-4">Expenses:</p>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                          <div className="max-h-64 overflow-y-auto">
                            <ul className="list-disc pl-6 space-y-3">
                              {getOrderExpenses(selectedOrder.id).map(
                                (expense, expIndex) =>
                                  expense.expenses.map((item, itemIndex) => (
                                    <li
                                      key={`${expIndex}-${itemIndex}`}
                                      className="bg-white p-3 rounded-md shadow-sm"
                                    >
                                      <div>
                                        <strong>Type:</strong> {item.type || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Amount:</strong>{" "}
                                        <IndianRupee
                                          size={14}
                                          className="inline"
                                        />
                                        <span>
                                          {parseFloat(item.amount || 0).toFixed(2)}
                                        </span>
                                      </div>
                                      <div>
                                        <strong>Date:</strong>{" "}
                                        {formatDate(expense.expense_date) || "N/A"}
                                      </div>
                                    </li>
                                  ))
                              )}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Payment Logs Section */}
                {selectedOrder.payment_logs &&
                  selectedOrder.payment_logs.length > 0 && (
                    <>
                      <Button
                        onClick={togglePaymentLogs}
                        className="mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
                      >
                        {showPaymentLogs
                          ? "Hide Payment Logs"
                          : `See Payment Logs (${
                              selectedOrder.payment_logs.length
                            })`}
                      </Button>
                      {showPaymentLogs && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                          <p className="font-semibold mb-3">Payment Logs:</p>
                          <div className="max-h-64 overflow-y-auto">
                            <ul className="list-disc pl-6 space-y-3">
                              {selectedOrder.payment_logs.map((log, index) => (
                                <li
                                  key={index}
                                  className="bg-white p-3 rounded-md shadow-sm"
                                >
                                  <div>
                                    <strong>Payment ID:</strong> {log.id}
                                  </div>
                                  <div>
                                    <strong>Amount:</strong>{" "}
                                    <IndianRupee size={14} className="inline" />
                                    <span>{log.payment_amount}</span>
                                  </div>
                                  <div>
                                    <strong>Date:</strong>{" "}
                                    {formatDate(log.created_at)}{" "}
                                    {formatTime24Hour(log.created_at)}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0 gap-2">
              {isEditing && (
                <Button
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
                >
                  Save Changes
                </Button>
              )}
              <Button
                onClick={closeModal}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}