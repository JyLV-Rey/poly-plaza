import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderFilterBar( {onApply} ) {
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortBy, setSortBy] = useState("order_id");
  const [isDescending, setIsDescending] = useState("Descending");
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to sanitize params from URL
  function safeGet(param) {
    const val = new URLSearchParams(location.search).get(param);
    return val === "null" || val === null || val === "undefined" ? "" : val;
  }

  // Load filter values from URL
  useEffect(() => {
    setOrderStatus(safeGet("orderStatus"));
    setDeliveryStatus(safeGet("deliveryStatus"));
    setPaymentStatus(safeGet("paymentStatus"));
    setSortBy(safeGet("sortBy") || "order_id");
    setIsDescending(safeGet("isDescending") || "Descending");
  }, [location.search]);

  function applyFilters() {
    const params = new URLSearchParams(location.search);

    // 🔄 Always reset each param explicitly
    if (orderStatus) {
      params.set("orderStatus", orderStatus);
    } else {
      params.delete("orderStatus");
    }

    if (deliveryStatus) {
      params.set("deliveryStatus", deliveryStatus);
    } else {
      params.delete("deliveryStatus");
    }

    if (paymentStatus) {
      params.set("paymentStatus", paymentStatus);
    } else {
      params.delete("paymentStatus");
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    if (isDescending) {
      params.set("isDescending", isDescending);
    } else {
      params.delete("isDescending");
    }

    const buyerId = new URLSearchParams(location.search).get("buyerId");
    if (buyerId) {
      params.set("buyerId", buyerId);
    }

    // 🔁 Update the URL
    navigate({ search: params.toString() });

    // 🚀 Trigger fetch immediately
    if (typeof onApply === "function") {
      onApply();
    }
  }
  return (
    <div className="flex flex-wrap text-neutral-500 gap-4 mb-4">
      {/* Order Status */}
      <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Order Status</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Shipped">Shipped</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Refunded">Refunded</option>
      </select>

      {/* Delivery Status */}
      <select value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Delivery Status</option>
        <option value="Preparing">Preparing</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
        <option value="Failed">Failed</option>
        <option value="Returned">Returned</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Payment Status */}
      <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Payment Status</option>
        <option value="Success">Success</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
        <option value="Refunded">Refunded</option>
      </select>

      {/* Sort By */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-lg">
        <option value="order_id">Order ID</option>
        <option value="price">Price</option>
      </select>

      {/* Sort Direction */}
      <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="border p-2 rounded-lg">
        <option value="Descending">Descending</option>
        <option value="Ascending">Ascending</option>
      </select>

      <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
    </div>
  );
}

export default OrderFilterBar;
