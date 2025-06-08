const { create_product } = require('../../supabase/controller/product');
const data = require('./product4.json');

(async () => {
  for (const item of data) {

  const createdProduct = await create_product(item);
  console.log('Created Product:', createdProduct);

  }
})();