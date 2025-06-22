import { supabase } from "../../../../supabase";

export async function getTotalSpent(buyerId) {
  const { data, error } = await supabase
    .from('order_item')
    .select(`
      quantity,
      order(buyer_id),
      product(price)
    `);

  if (error) {
    console.error('Error fetching total spent:', error);
    return 0;
  }

  let total = 0;
  for (const row of data) {
    if (String(row.order?.buyer_id) !== String(buyerId)) continue;
    const price = parseFloat(row.product?.price || 0);
    const qty = parseInt(row.quantity || 0);
    total += price * qty;
  }

  return total;
}

export async function getTotalOrdersPlaced(buyerId) {
  const { count, error } = await supabase
    .from('order')
    .select('order_id', { count: 'exact', head: true })
    .eq('buyer_id', buyerId);

  if (error) {
    console.error('Error fetching total orders:', error);
    return 0;
  }

  return count;
}

// Get total number of cancelled orders
export async function getTotalCancelledOrders(buyerId) {
  const { count, error } = await supabase
    .from("order")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", buyerId)
    .eq("status", "Cancelled");

  if (error) {
    console.error("Error fetching cancelled orders:", error);
    return 0;
  }

  return count;
}

// Get total number of refund requests
export async function getTotalRefunds(buyerId) {
  const { count, error } = await supabase
    .from("refund")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", buyerId); // assuming refund has buyer_id

  // if refund doesn't have buyer_id, join through `order` table instead
  if (error || count === null) {
    // fallback: join order + refund if no buyer_id in refund table
    const { data, error: joinError } = await supabase
      .from("refund")
      .select("order_id")
      .eq("refund_status", "Pending"); // or remove filter

    if (joinError || !data) return 0;

    const orderIds = data.map(r => r.order_id);

    const { data: matchingOrders, error: orderError } = await supabase
      .from("order")
      .select("order_id")
      .in("order_id", orderIds)
      .eq("buyer_id", buyerId);

    if (orderError || !matchingOrders) return 0;
    return matchingOrders.length;
  }

  return count;
}
