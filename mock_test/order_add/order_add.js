const { create_order_raw } = require('../../supabase/controller/order');

const data = [{"buyer_id":1005,"status":"Pending","product_id":291,"quantity":4,"payment_method":"UPI","street":"Kennedy","city":"Cabalawan","postal_code":"6006","delivery_status":"In Transit","courier_service":"GoGo Xpress"}];

const data2 = require('./orderlinemain.json');

(async() => {
  for (const item of data2) {

  const createdOrder = await create_order_raw(item);
  console.log('Created Order:', createdOrder);

  }
})()

async() => {
  // Prints the first 10 numbers
  
}