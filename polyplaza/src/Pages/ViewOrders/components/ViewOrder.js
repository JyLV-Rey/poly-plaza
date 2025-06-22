import { supabase } from "../../../supabase";

function clean(val) {
  return val === null || val === "null" || val === "undefined" ? null : val;
}

async function getOrder(buyerId, filters = {}) {
  const orderStatus = clean(filters.orderStatus);
  const deliveryStatus = clean(filters.deliveryStatus);
  const paymentStatus = clean(filters.paymentStatus);
  const sortBy = clean(filters.sortBy) || "order_id";
  const isDescending = clean(filters.isDescending) || "Descending";
  const ascending = isDescending === "Ascending";

  let query = supabase
    .from("order")
    .select(`
      order_id,
      ordered_at,
      status,

      refund(
        refund_status,
        refund_reason,
        processed_at,
        refund_id
      ),

      cancel(
        cancel_reason,
        cancel_date,
        cancel_id
      ),

      delivery (
        delivery_status,
        courier_service,
        tracking_number,
        delivery_date,
        address (
          street,
          city,
          postal_code
        )
      ),
      payment (
        payment_id,
        payment_method,
        payment_status,
        paid_at
      ),
      order_item (
        product_id,
        quantity,
        product (
          name,
          category,
          price,
          product_image (
            image_url
          ),
          seller (
            seller_name,
            address (
              street,
              city,
              postal_code
            )
          )
        )
      )
    `)
    .eq("buyer_id", buyerId);

  // Filter by order status directly
  if (orderStatus) {
    query = query.eq("status", orderStatus);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  // ✅ Post-filter orders that do NOT match nested delivery/payment status
  let filtered = data;

  if (deliveryStatus) {
    filtered = filtered.filter(order =>
      order.delivery.some(d => d?.delivery_status === deliveryStatus)
    );
  }

  if (paymentStatus) {
    filtered = filtered.filter(order =>
      order.payment.some(p => p?.payment_status === paymentStatus)
    );
  }

  if (sortBy === "price") {
    filtered.sort((a, b) => {
      const totalA = a.order_item.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
      const totalB = b.order_item.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
      return ascending ? totalA - totalB : totalB - totalA;
    });
  } else {
    filtered.sort((a, b) => {
      return ascending ? a.order_id - b.order_id : b.order_id - a.order_id;
    });
  }

  return filtered;
}

export default getOrder;
