const supabase = require('../main');
// {"buyer_id":1005,"status":"Pending","product_id":291,"quantity":4,"payment_method":"UPI","street":"Kennedy","city":"Cabalawan","postal_code":"6006","delivery_status":"In Transit","courier_service":"GoGo Xpress"}
async function create_order_raw(data) {
  const { buyer_id, status, product_id, quantity, payment_method, street, city, postal_code, delivery_status, courier_service } = data;

  const {data: order_data, error: order_error} = await supabase
    .from('order')
    .insert([
      {
        buyer_id: buyer_id,
        status: status
      }
    ])
    .select()
    .single();
  
  if (order_error) {
    console.error('Error creating order:', order_error);
    throw order_error;
  }

  const { data: order_item_data, error: order_item_error } = await supabase
    .from('order_item')
    .insert([
      {
        order_id: order_data.order_id,
        product_id: product_id,
        quantity: quantity
      }
    ])
    .select()
    .single();

  if (order_item_error) {
    console.error('Error placing order_item:', order_item_error);
    throw order_item_error;
  }

  const { data: payment_data, error: payment_error } = await supabase
    .from('payment')
    .insert([
      {
        order_id: order_data.order_id,
        payment_method: payment_method,
        payment_status: 'Success'
      }
    ])
    .select()
    .single();
  if (payment_error) {
    console.error('Error creating payment:', payment_error);
    throw payment_error;
  }

  const { data: delivery_data, error: delivery_error } = await supabase
    .from('delivery')
    .insert([
      {
        order_id: order_data.order_id,
        street: street,
        city: city,
        postal_code: postal_code,
        delivery_status: delivery_status,
        courier_service: courier_service
      }
    ])
    .select()
    .single();

  if (delivery_error) {
    console.error('Error creating delivery:', delivery_error);
    throw delivery_error;
  }

  return {
    order: order_data,
    order_item: order_item_data,
    payment: payment_data,
    delivery: delivery_data
  };
}

module.exports = {
  create_order_raw
};