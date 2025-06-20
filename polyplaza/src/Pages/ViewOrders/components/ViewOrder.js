import { supabase } from "../../../supabase";


async function getOrder(buyerId) {
      const { data, error } = await supabase
        .from("order")
        .select(`
          order_id,
          ordered_at,
          status,

          delivery (
            delivery_status,
            courier_service,
            tracking_number,
            delivery_date
          ),

          payment(
            payment_id,
            payment_method,
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
        .eq("buyer_id", buyerId)
        .order('order_id', { ascending: false });
      if (error) {
        console.error("Error fetching orders:", error);
      } else {

        console.log(data);
        return data;
      }
}

export default getOrder