import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import { getTotalSpent, getTotalOrdersPlaced, getTotalCancelledOrders, getTotalRefunds } from './components/userAggregate';
import CheckCredentials from '../../CheckCredentials';
import BuyerTopCategoryDoughnut from './components/BuyerTopCategoryDoughnut';
import BuyerSpendLineChart from './components/BuyerSpendLineChart';
import BuyerSpendByCategoryBar from './components/BuyerSpendByCategoryBar';
import BuyerPurchaseFrequencyBar from './components/BuyerPurchaseFrequencyBar';
import BuyerTopProductsBar from './components/BuyerTopProductsBar';
import BuyerReviewRatingBar from './components/BuyerReviewRatingBar';
import BuyerPreferredSellersDoughnut from './components/BuyerPreferredSellersDoughnut';
import BuyerPaymentMethodPie from './components/BuyerPaymentMethodPie';
import ChartBox from '../ChartBox';
import PieChartBox from '../PieChartBox';
import BuyerMostExpensiveBoughtItemsBar from './components/BuyerMostExpensiveBoughtItemsBar';
import BuyerLeastExpensiveBoughtItemsBar from './components/BuyerLeastExpensiveBoughtItemsBar';

function BuyerDashboard() {
  const [searchParams] = useSearchParams();
  const buyerId = searchParams.get('buyerId');

  const [totalCancelled, setTotalCancelled] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [userData, setUserData] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

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

    async function load() {
      const spent = await getTotalSpent(buyerId);
      const orders = await getTotalOrdersPlaced(buyerId);
      const cancelled = await getTotalCancelledOrders(buyerId);
      const refunds = await getTotalRefunds(buyerId);

      setTotalOrders(orders);
      setTotalSpent(spent);
      setTotalCancelled(cancelled);
      setTotalRefunds(refunds);
    }
    load();
    }

    fetchAndSetUserData();
  }, [buyerId]);

  if(userData?.is_deleted) return <div className="min-h-screen min-w-screen bg-gray-50 font-extrabold text-neutral-900 flex justify-center items-center text-6xl">Buyer is Deleted</div>

  return (
    <>
      <CheckCredentials>
        <div className='mt-20 flex flex-col p-10'>

          <div className='flex flex-row justify-between w-full'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <h1 className='text-4xl text-neutral-700 text-start font-extrabold'>{userData?.first_name} {userData?.last_name}'s Profile</h1>
              </div>
              <h2 className='text-xl text-neutral-600 text-start font-bold'>Email: {userData?.email}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Date Joined: {new Date(userData?.created_at).toLocaleString()}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Phone Number: {userData?.phone}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Buyer ID: {buyerId}</h2>

            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl text-neutral-700 text-end font-extrabold'>Total Spent: ₱{totalSpent.toLocaleString()}</h1>
              <h2 className='text-xl text-neutral-500 text-end font-bold'>Total Orders: {totalOrders.toLocaleString()}</h2>
              <h2 className='text-lg text-neutral-500 font-medium text-end'>Cancelled Orders: {totalCancelled}</h2>
              <h2 className='text-lg text-neutral-500 font-medium text-end'>Refunds: {totalRefunds}</h2>
              <div className='flex flex-row gap-2 self-end'>
                <Link to={`/orders?buyerId=${buyerId}`} className='bg-pink-500 hover:bg-pink-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-pink-500 hover:font-extrabold hover:border-2 border-pink-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>View Orders</Link>
                <Link to={`/edit/buyer?buyerId=${buyerId}`} className='bg-emerald-500 hover:bg-emerald-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-emerald-500 hover:font-extrabold hover:border-2 border-emerald-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>Edit Profile</Link>
              </div>
            </div>
          </div>

          <div className=' flex flex-row gap-2 mt-5 flex-wrap justify-around flex-grow items-center'>

          <PieChartBox title="Most Bought Categories">
            <BuyerTopCategoryDoughnut buyerId={buyerId} />
          </PieChartBox>

          <ChartBox title="Spending Over The Months">
            <BuyerSpendLineChart buyerId={buyerId} />
          </ChartBox>

          <ChartBox title="Spending By Category">
            <BuyerSpendByCategoryBar buyerId={buyerId} />
          </ChartBox>

          <ChartBox title="Purchase Frequency">
            <BuyerPurchaseFrequencyBar buyerId={buyerId} />
          </ChartBox>
          
          <ChartBox title="Top Purchased Products">
            <BuyerTopProductsBar buyerId={buyerId} />
          </ChartBox>

          <ChartBox title="Review Ratings">
            <BuyerReviewRatingBar buyerId={buyerId} />
          </ChartBox>

          <PieChartBox title='Preferred Sellers'>
            <BuyerPreferredSellersDoughnut buyerId={buyerId} />
          </PieChartBox>

          <PieChartBox title='Payment Methods'>
            <BuyerPaymentMethodPie buyerId={buyerId} />
          </PieChartBox>

          <ChartBox title="Most Expensive Items Bought">
            <BuyerMostExpensiveBoughtItemsBar buyerId={buyerId} />
          </ChartBox>

          <ChartBox title="Least Expensive Items Bought">
            <BuyerLeastExpensiveBoughtItemsBar buyerId={buyerId} />
          </ChartBox>

          </div>
        </div>
      </CheckCredentials>
    </>
  );
}

export default BuyerDashboard;