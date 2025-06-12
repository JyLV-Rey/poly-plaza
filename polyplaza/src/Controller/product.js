const supabase = require('../main');

async function create_product(data) {
  const { seller_id, name, description, price, category } = data;

  const { data: product_data, error: product_error } = await supabase
    .from('product')
    .insert([
      {
        seller_id: seller_id,
        name: name,
        description: description,
        price: price,
        category: category
      }
    ])
    .select()
    .single();

  if (product_error) {
    console.error('Error creating product:', product_error);
    throw product_error;
  }

  return product_data;
}



async function update_product(data) {
  const { product_id, name, description, price, category } = data;

  const { data: product_data, error: product_error } = await supabase
    .from('product')
    .update({
      name: name,
      description: description,
      price: price,
      category: category
    })
    .eq('product_id', product_id)
    .select()
    .single();

  if (product_error) {
    console.error('Error updating product:', product_error);
    throw product_error;
  }

  return product_data;
}

module.exports = { create_product, update_product };