const { create_product_image } = require('../../supabase/controller/product_image');
const data = require('./imageset1-1.json');
(async () => {
  for(const item of data) {
    try {
      const result = await create_product_image(item);
      console.log('Product image created successfully:', result);
    } catch (error) {
      console.error('Error updating product image:', error);
    }
  }}
)();