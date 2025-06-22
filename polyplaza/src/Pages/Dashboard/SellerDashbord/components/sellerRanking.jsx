// /components/sellerRanking.js
import { supabase } from '../../../../supabase';

export async function getSellerStats() {
  const { data, error } = await supabase
    .from('order_item')
    .select(`
      quantity,
      product:product_id (
        price,
        seller_id,
        seller:seller_id (
          seller_name
        )
      )
    `);

  if (error || !data?.length) {
    console.error('Error fetching seller stats:', error);
    return [];
  }

  const sellerMap = {};

  for (const item of data) {
    const sellerId = item.product?.seller_id;
    const sellerName = item.product?.seller?.seller_name;

    if (!sellerId || !sellerName) continue;

    if (!sellerMap[sellerId]) {
      sellerMap[sellerId] = { sellerName, totalSold: 0, totalRevenue: 0 };
    }

    sellerMap[sellerId].totalSold += item.quantity;
    sellerMap[sellerId].totalRevenue += item.quantity * item.product.price;
  }

  // Convert to array
  return Object.entries(sellerMap)
    .map(([sellerId, data]) => ({ sellerId, ...data }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue); // Default sort by revenue
}
