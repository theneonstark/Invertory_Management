import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import FilterOrders from "./FilterOrders";
import RecentOrders from "./RecentOrders";
import AllOrders from "./AllOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import { UpdateOrders } from "@/lib/Apis";

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
  const [deliveredStartDate, setDeliveredStartDate] = useState(""); // New state for delivered start date
  const [deliveredEndDate, setDeliveredEndDate] = useState(""); // New state for delivered end date
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredOrders = useMemo(() => {
    return userorders
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((order) => {
        const orderDate = new Date(order.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const deliveredDate = order.delivered_date
          ? new Date(order.delivered_date)
          : null;
        const deliveredStart = deliveredStartDate
          ? new Date(deliveredStartDate)
          : null;
        const deliveredEnd = deliveredEndDate ? new Date(deliveredEndDate) : null;

        const dateFilter =
          (!start || orderDate >= start) && (!end || orderDate <= end);
        const deliveredDateFilter =
          (!deliveredStart || (deliveredDate && deliveredDate >= deliveredStart)) &&
          (!deliveredEnd || (deliveredDate && deliveredDate <= deliveredEnd));
        const statusFilterCheck =
          statusFilter === "all" ||
          (statusFilter === "pending" && order.pending_payment !== "0.00") ||
          (statusFilter === "paid" && order.pending_payment === "0.00");

        const searchFilter =
          searchQuery === "" ||
          order.id.toString().includes(searchQuery) ||
          order.user_name.toLowerCase().includes(searchQuery.toLowerCase());

        return dateFilter && deliveredDateFilter && statusFilterCheck && searchFilter;
      });
  }, [
    userorders,
    startDate,
    endDate,
    deliveredStartDate, // Added to dependencies
    deliveredEndDate, // Added to dependencies
    statusFilter,
    searchQuery,
  ]);

  const exportToExcel = () => {
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

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 10 },
      { wch: 30 },
      { wch: 25 },
      { wch: 50 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(
      workbook,
      `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <FilterOrders
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        deliveredStartDate={deliveredStartDate} // Pass new state
        setDeliveredStartDate={setDeliveredStartDate} // Pass new setter
        deliveredEndDate={deliveredEndDate} // Pass new state
        setDeliveredEndDate={setDeliveredEndDate} // Pass new setter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        exportToExcel={exportToExcel}
        filteredOrders={filteredOrders}
      />
      <RecentOrders
        orders={filteredOrders.slice(0, 9)}
        onOrderClick={handleOrderClick}
        formatDate={formatDate}
        formatTime24Hour={formatTime24Hour}
        formatDateTime={formatDateTime}
        calculateTotalExpenses={calculateTotalExpenses}
      />
      <AllOrders
        orders={filteredOrders}
        currentPage={currentPage}
        ordersPerPage={ordersPerPage}
        onOrderClick={handleOrderClick}
        onPageChange={setCurrentPage}
        formatDate={formatDate}
        formatTime24Hour={formatTime24Hour}
        formatDateTime={formatDateTime}
        calculateTotalExpenses={calculateTotalExpenses}
      />
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModal}
          onUpdateOrder={onUpdateOrder}
          formatDate={formatDate}
          formatTime24Hour={formatTime24Hour}
          formatDateTime={formatDateTime}
          calculateTotalExpenses={calculateTotalExpenses}
          getOrderExpenses={getOrderExpenses}
          updateOrders={UpdateOrders}
        />
      )}
    </div>
  );
}