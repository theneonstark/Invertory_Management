import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdateOrder,
  formatDate,
  formatTime24Hour,
  formatDateTime,
  calculateTotalExpenses,
  getOrderExpenses,
  updateOrders,
}) {
  const [showPaymentLogs, setShowPaymentLogs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState({
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
  });

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

      const response = await updateOrders(editedOrder.id, orderData);

      if (response) {
        if (onUpdateOrder) {
          onUpdateOrder(response.data);
        }
        setEditedOrder({
          ...response.data,
          created_at_date: response.data.created_at
            ? new Date(response.data.created_at).toISOString().split("T")[0]
            : "",
          created_at_time: response.data.created_at
            ? new Date(response.data.created_at)
                .toLocaleTimeString("en-US", { hour12: false })
                .slice(0, 5)
            : "12:00",
          delivered_date_date: response.data.delivered_date
            ? new Date(response.data.delivered_date).toISOString().split("T")[0]
            : "",
          delivered_date_time: response.data.delivered_date
            ? new Date(response.data.delivered_date)
                .toLocaleTimeString("en-US", { hour12: false })
                .slice(0, 5)
            : "12:00",
          pickup_time_date: response.data.pickup_time
            ? new Date(response.data.pickup_time).toISOString().split("T")[0]
            : "",
          pickup_time_time: response.data.pickup_time
            ? new Date(response.data.pickup_time)
                .toLocaleTimeString("en-US", { hour12: false })
                .slice(0, 5)
            : "12:00",
        });
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

  return (
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
                  <Label>Client Name:</Label>
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
                          handleInputChange("created_at_time", e.target.value)
                        }
                        className="flex-1 border-gray-300 rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Client Email:</Label>
                  <Input
                    value={editedOrder.user_email}
                    onChange={(e) =>
                      handleInputChange("user_email", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Client Phone:</Label>
                  <Input
                    value={editedOrder.user_phone}
                    onChange={(e) =>
                      handleInputChange("user_phone", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Client Address:</Label>
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
                  <Label>Client Zip:</Label>
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
                        handleInputChange("delivered_date_date", e.target.value)
                      }
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={editedOrder.delivered_date_time}
                        onChange={(e) =>
                          handleInputChange("delivered_date_time", e.target.value)
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
                          handleInputChange("pickup_time_time", e.target.value)
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
                  <strong>User ID:</strong> {order.user_id}
                </p>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Billing No:</strong> {order.billing_number}
                </p>
                <p>
                  <strong>Client Name:</strong> {order.user_name}
                </p>
                <p>
                  <strong>Order Date:</strong> {formatDate(order.created_at)}{" "}
                  {formatTime24Hour(order.created_at)}
                </p>
                <p>
                  <strong>Client Email:</strong> {order.user_email}
                </p>
                <p>
                  <strong>Client Phone:</strong> {order.user_phone}
                </p>
                <p>
                  <strong>Client Address:</strong> {order.user_address}
                </p>
                <p>
                  <strong>Client City:</strong> {order.user_city}
                </p>
                <p>
                  <strong>Client Zip:</strong> {order.user_zip}
                </p>
                <p className="text-cyan-700">
                  <strong>Shipping Add:</strong> {order.shipping_address}
                </p>
                <p>
                  <strong>Delivered Date:</strong>{" "}
                  {formatDateTime(order.delivered_date)}
                </p>
                <p>
                  <strong>Pickup Date:</strong> {formatDateTime(order.pickup_time)}
                </p>
                <p>
                  <strong>Updated At:</strong> {formatDate(order.updated_at)}{" "}
                  {formatTime24Hour(order.updated_at)}
                </p>
                <div className="flex items-center text-yellow-600 font-bold">
                  <strong>Total Amount:</strong>
                  <IndianRupee size={16} className="mx-2" />
                  <span>{order.total_amount}</span>
                </div>
                <div className="flex items-center text-green-400 font-bold">
                  <strong>Paid Payment:</strong>
                  <IndianRupee size={16} className="mx-2" />
                  <span>{order.paid_payment}</span>
                </div>
                <div className="flex items-center text-red-400 font-bold">
                  <strong>Pending Payment:</strong>
                  <IndianRupee size={16} className="mx-2" />
                  <span>{order.pending_payment}</span>
                </div>
                <div className="flex items-center">
                  <strong>Total Expenses:</strong>
                  <IndianRupee size={16} className="mx-2" />
                  <span>{calculateTotalExpenses(order.id)}</span>
                </div>
                <p>
                  <strong>Products:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  {order.products.map((product, index) => (
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
                {getOrderExpenses(order.id).length > 0 && (
                  <>
                    <p className="font-semibold mt-4">Expenses:</p>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                      <div className="max-h-64 overflow-y-auto">
                        <ul className="list-disc pl-6 space-y-3">
                          {getOrderExpenses(order.id).map((expense, expIndex) =>
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
                                  <IndianRupee size={14} className="inline" />
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
            {order.payment_logs && order.payment_logs.length > 0 && (
              <>
                <Button
                  onClick={togglePaymentLogs}
                  className="mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
                >
                  {showPaymentLogs
                    ? "Hide Payment Logs"
                    : `See Payment Logs (${order.payment_logs.length})`}
                </Button>
                {showPaymentLogs && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                    <p className="font-semibold mb-3">Payment Logs:</p>
                    <div className="max-h-64 overflow-y-auto">
                      <ul className="list-disc pl-6 space-y-3">
                        {order.payment_logs.map((log, index) => (
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
                              <strong>Date:</strong> {formatDate(log.created_at)}{" "}
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
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}