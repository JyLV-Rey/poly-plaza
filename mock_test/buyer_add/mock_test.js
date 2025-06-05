const { create_buyer } = require('../../supabase/controller/buyer');
const data = require('./main_user.json');

(async () => {
  for (const buyer of data) {
    try {
      const createdBuyer = await create_buyer(buyer);
      console.log('Created Buyer:', createdBuyer);
    } catch (error) {
      console.error('Error in mock test:', error);
      break;
    }
  }
})();