import AdminNavBar from "../AdminNavBar";
import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OrderFilterBar from "./OrderFilterBar";

function OrdersView() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchOrders() {
      const params = new URLSearchParams(location.search);
      const firstName = params.get("first_name");
      const lastName = params.get("last_name");
      const sortBy = params.get("sortBy") || "ordered_at";
      const isDescending = params.get("isDescending") === "Descending";
      const isDeleted = params.get("isDeleted");

      let query = supabase
        .from("order")
        .select("*, buyer(first_name, last_name)");

      if (isDeleted === "true") query = query.eq("is_deleted", true);
      if (isDeleted === "false") query = query.eq("is_deleted", false);

      if (firstName) query = query.ilike("buyer.first_name", `%${firstName}%`);
      if (lastName) query = query.ilike("buyer.last_name", `%${lastName}%`);

      query = query.order(sortBy, { ascending: !isDescending });

      const { data, error } = await query;
      if (!error) setOrders(data);
    }

    fetchOrders();
  }, [location.search]);

  function getColor(isDeleted) {
    return isDeleted
      ? "bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-500 border-emerald-500"
      : "bg-red-500 hover:bg-red-100 hover:text-red-500 border-red-500";
  }

  async function handleToggle(isDeleted, orderId) {
    const { error } = await supabase
      .from("order")
      .update({ is_deleted: !isDeleted })
      .eq("order_id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId
            ? { ...order, is_deleted: !isDeleted }
            : order
        )
      );
    }
  }

  return (
    <>
      <AdminNavBar />

      <div className="flex flex-col items-center justify-center w-auto ml-70 mt-30 m-5">
        <div className="p-5 flex flex-col border-neutral-300 border-2 rounded-xl m-2">
          <p className="text-xl text-neutral-500 text-center font-extrabold mb-2">Select Filters</p>
          <OrderFilterBar />
        </div>

        <div className="grid grid-cols-8 gap-2 text-lg bg-neutral-400 text-neutral-50 font-bold w-full ">
          <p>Order ID</p>
          <p>Buyer ID</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Status</p>
          <p>Ordered At</p>
          <p>Is Deleted</p>
          <p>Action</p>
        </div>

        <div className="flex flex-col font-medium text-sm text-neutral-600 w-full">
          {orders?.map((order) => (
            <div key={order.order_id} className="border border-neutral-300">
              <div
                className="grid grid-cols-8 text-sm text-neutral-600 font-medium w-full divide-x divide-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 cursor-pointer"
                onClick={() => navigate(`/product/view_receipt?orderId=${order.order_id}`)}
              >
                <p className="px-2">{order.order_id}</p>
                <p className="px-2">{order.buyer_id}</p>
                <p className="px-2">{order.buyer?.first_name}</p>
                <p className="px-2">{order.buyer?.last_name}</p>
                <p className="px-2">{order.status}</p>
                <p className="px-2">{new Date(order.ordered_at).toLocaleString()}</p>
                <p className="px-2">{order.is_deleted ? "Yes" : "No"}</p>

                <div className="px-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggle(order.is_deleted, order.order_id)}
                    className={`${getColor(order.is_deleted)} duration-200 transform hover:scale-105 hover:font-extrabold hover:border-2 text-white font-bold rounded w-fit text-sm p-1`}
                  >
                    {order.is_deleted ? "Enable" : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OrdersView;
