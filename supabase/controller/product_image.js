const supabase = require('../main');

async function create_product_image(data){
  const { product_id, image_url } = data;

  const { data: product_image_data, error: product_image_error } = await supabase
    .from('product_image')
    .insert([
      {
        product_id: product_id,
        image_url: image_url
      }
    ])
    .select()
    .single();

  if (product_image_error) {
    console.error('Error creating product image:', product_image_error);
    throw product_image_error;
  }

  return product_image_data;
};

async function update_product_image(data) {
  const { product_id, image_url } = data;

  const { data: product_image_data, error: product_image_error } = await supabase
    .from('product_image')
    .update({
      image_url: image_url
    })
    .eq('product_id', product_id)
    .select()
    .single();

  if (product_image_error) {
    console.error('Error updating product image:', product_image_error);
    throw product_image_error;
  }

  return product_image_data;
}

module.exports = {
  create_product_image,
  update_product_image
};