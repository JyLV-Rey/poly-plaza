import { useSearchParams } from 'react-router-dom';
import CheckCredentials from '../../CheckCredentials';
import BuyerTopCategoryDoughnut from './components/BuyerTopCategoryDoughnut';
import BuyerSpendLineChart from './components/BuyerSpendLineChart';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import BuyerSpendByCategoryBar from './components/BuyerSpendByCategoryBar';
import BuyerPurchaseFrequencyBar from './components/BuyerPurchaseFrequencyBar';
import BuyerTopProductsBar from './components/BuyerTopProductsBar';
import BuyerReviewRatingBar from './components/BuyerReviewRatingBar';

function BuyerDashboard() {
  const [searchParams] = useSearchParams();
  const buyerId = searchParams.get('buyerId');

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchAndSetUserData() {
      const { data, error } = await supabase
        .from('buyer')
        .select('*')
        .eq('buyer_id', buyerId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      setUserData(data);
      //console.log("userData:", data);
    }

    fetchAndSetUserData();
  }, [buyerId]);

  return (
    <>
      <CheckCredentials>
        <div className='mt-20 flex flex-col p-10'>

          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl text-neutral-500 text-start font-extrabold'>Dashboard for {userData?.first_name} {userData?.last_name}</h1>
            <h2 className='text-xl text-neutral-400 text-start font-bold'>Email: {userData?.email}</h2>
            <h2 className='text-lg text-neutral-400 text-start font-medium'>Date Joined: {new Date(userData?.created_at).toLocaleString()}</h2>
          </div>

          <div className=' flex flex-row gap-5 mt-5 flex-wrap justify-around flex-grow items-center'>

            <div className='flex flex-col p-5 border-2 bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Most Bought Categories </p>
              <div className='flex flex-col w-full h-full '>
                <BuyerTopCategoryDoughnut buyerId={buyerId} />
              </div>
            </div>

            <div className='flex flex-col p-5 border-2 bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Spending Over the Months</p>
              <div className='flex flex-col w-150 h-full '>
                <BuyerSpendLineChart buyerId={buyerId} />
              </div>
            </div>

            <div className='flex flex-col p-5 border-2 bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Spending Over Categories</p>
              <div className='flex flex-col w-150 h-full '>
                <BuyerSpendByCategoryBar buyerId={buyerId} />
              </div>
            </div>

            <div className='flex flex-col p-5 border-2 bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Amount of Purchases Per Month</p>
              <div className='flex flex-col w-150 h-full '>
                <BuyerPurchaseFrequencyBar buyerId={buyerId} />
              </div>
            </div>
          
            <div className='flex flex-col p-5 border-2 h-fit bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Most Paid Products</p>
              <div className='flex flex-col w-100 h-full '>
                <BuyerTopProductsBar buyerId={buyerId} />
              </div>
            </div>

            <div className='flex flex-col p-5 border-2 h-fit bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
              <p className='text-xl text-neutral-500 text-center font-extrabold'>Review Distribution</p>
              <div className='flex flex-col w-100 h-full '>
                <BuyerReviewRatingBar buyerId={buyerId} />
              </div>
            </div>

          </div>
        </div>
      </CheckCredentials>
    </>
  );
}

export default BuyerDashboard;