const {create_buyer, get_buyer_by_id} = require('../../supabase/controller/buyer');
const supabase = require('../../supabase/main');

const START_DATE = '2022-01-01';
const END_DATE = '2024-12-31';

function getRandomTimestamp(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = new Date(start + Math.random() * (end - start));
  return randomTime.toISOString();
}

async function updateBuyersDateCreated() {
  const { data, error } = await supabase
    .from('buyer')
    .select('buyer_id')
    .gt('buyer_id', 1) // Get from ID 2 onward
    .limit(1000);

  if (error) {
    console.error('❌ Failed to fetch buyers:', error.message);
    return;
  }

  for (const buyer of data) {
    const randomDate = getRandomTimestamp(START_DATE, END_DATE);

    const { error: updateError } = await supabase
      .from('buyer')
      .update({ created_at: randomDate })
      .eq('buyer_id', buyer.buyer_id);

    if (updateError) {
      console.error(`❌ Failed to update buyer ${buyer.buyer_id}:`, updateError.message);
    } else {
      console.log(`✅ Updated buyer ${buyer.buyer_id} to ${randomDate}`);
    }
  }

  console.log('🎉 Done updating 1000 buyers');
}

updateBuyersDateCreated();