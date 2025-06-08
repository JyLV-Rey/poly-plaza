const supabase = require('../main');

async function create_seller(data) {
  const {buyer_id, seller_name} = data;

    const { data: seller_data, error: seller_error } = await supabase
    .from('seller')
    .insert([
      {
        buyer_id: buyer_id,
        seller_name: seller_name
      }
    ])
    .select()
    .single();

    if(seller_error) {
    console.error('Error creating seller:', seller_error);
    throw seller_error;
    }

    const seller_id = seller_data.seller_id;

  const { buyer_error } = await supabase
    .from('buyer')
    .update({
      seller_id: seller_id
    })
    .eq('buyer_id', buyer_id)
    .single();

  if (buyer_error) {
    console.error('Error fetching buyer:', buyer_error);
    throw buyer_error;
  }

  return seller_id;
}


module.exports = {
  create_seller
};