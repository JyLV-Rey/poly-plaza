import { supabase } from '../../../../supabase';

export async function getTotalCancelledBySeller(sellerId) {
  // Step 1: Get all order items with seller_id joined via product
  const { data: orderItems, error: itemError } = await supabase
    .from('order_item')
    .select(`
      order_id,
      product:product_id (
        seller_id
      )
    `);

  if (itemError || !orderItems?.length) return 0;

  // Step 2: Filter by this seller's products
  const sellerOrderIds = orderItems
    .filter((item) => String(item.product?.seller_id) === String(sellerId))
    .map((item) => item.order_id);

  if (sellerOrderIds.length === 0) return 0;

  // Step 3: Count cancels that match those order_ids
  const { count, error } = await supabase
    .from('cancel')
    .select('cancel_id', { count: 'exact', head: true })
    .in('order_id', sellerOrderIds);

  return error ? 0 : count;
}

export async function getTotalRefundedBySeller(sellerId) {
  const { data: orderItems, error: itemError } = await supabase
    .from('order_item')
    .select(`
      order_id,
      product:product_id (
        seller_id
      )
    `);

  if (itemError || !orderItems?.length) return 0;

  const sellerOrderIds = orderItems
    .filter((item) => String(item.product?.seller_id) === String(sellerId))
    .map((item) => item.order_id);

  if (sellerOrderIds.length === 0) return 0;

  const { count, error } = await supabase
    .from('refund')
    .select('refund_id', { count: 'exact', head: true })
    .in('order_id', sellerOrderIds);

  return error ? 0 : count;
}

export async function getAverageStoreRating(sellerId) {
  const { data: reviews, error } = await supabase
    .from('review')
    .select(`
      rating,
      product:product_id (
        seller_id
      )
    `);

  if (error || !reviews?.length) return 0;

  const relevant = reviews.filter(
    (r) => String(r.product?.seller_id) === String(sellerId)
  );

  if (!relevant.length) return 0;

  const avg =
    relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length;

  return avg;
}
