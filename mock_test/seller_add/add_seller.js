import { create_seller } from '../../supabase/controller/seller.js';

(async () => {
  try {
    const data = {
      buyer_id: 1005, // Replace with actual buyer_id
      seller_name: 'Andrademeda'
    };

    const seller_id = await create_seller(data);
    console.log('Seller created successfully with ID:', seller_id);
  } catch (error) {
    console.error('Error creating seller:', error);
  }

})()