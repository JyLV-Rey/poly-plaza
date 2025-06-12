import supabase from '../main';
import bcrypt from 'bcryptjs';

async function create_buyer(data) {

  const { first_name, last_name, email, password, phone } = data;
  const hashed_password = await bcrypt.hash(password, 10);

  const { error, data: result } = await supabase
    .from('buyer')
    .insert([
      {
        last_name: last_name,
        first_name: first_name,
        email: email,
        password: hashed_password,
        phone: phone
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating buyer:', error);
    throw error;
  } else {
    console.log('Buyer created successfully:', result);
  }

  const current_buyer_id = result.id;

  const { error: cart_error } = await supabase
    .from('cart')
    .insert([
      {
        buyer_id: current_buyer_id
      }
    ]);

  if (cart_error) {
    console.error('Error creating cart for buyer:', cart_error);
    throw cart_error;
  }

  return result;
}

async function get_buyer_by_id(data) {
  const { buyer_id } = data;

  const { data: buyer, error } = await supabase
    .from('buyer')
    .select('*')
    .eq('id', buyer_id)
    .single();

    if (error) {
    console.error('Error fetching buyer:', error);
    throw error;
  } else {
    console.log('Buyer fetched successfully:', buyer);
    return buyer;
  }
}




module.exports = {
  create_buyer,
  get_buyer_by_id
};
