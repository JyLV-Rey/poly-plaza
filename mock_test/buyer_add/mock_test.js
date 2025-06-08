const { create_buyer } = require('../../supabase/controller/buyer');

(async () => {

  const data =
  [{
    first_name: "Gerard",
    last_name: "Andrade",
    email: "gerardandrade@gmail.com",
    password: "GerardAndrade",
    phone: "345-765-5436"
  }];

  try {
    const createdBuyer = await create_buyer(data[0]);
    console.log('Created Buyer:', createdBuyer);
  } catch (error) {
    console.error('Error in mock test:', error);
  }
})();