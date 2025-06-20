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
