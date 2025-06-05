const supabase = require('../main');

async function create_seller(data) {
  const {buyer_id, seller_id, seller_name} = data;

  const { buyer_error, data: buyer_result } = await supabase
    .from('buyer')
    .select('buyer_id')
    .eq('buyer_id', buyer_id)
    .single();
  const { seller_error, data: seller_result } = await supabase
    .from('seller')
    .insert([
      {
        buyer_id: buyer_id,
        seller_id: seller_id,
        seller_name: seller_name
      }
    ]);
  
    
}