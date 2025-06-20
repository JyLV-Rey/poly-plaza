import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import CheckCredentials from '../../CheckCredentials';
import SellerTopProductsBar from './components/SellerTopProductsBar';
import SellerTopCategoriesBar from './components/SellerTopCategoriesBar';
import SellerMonthlyEarningsLineChart from './components/SellerMonthlyEarningsLineChart';
import ChartBox from '../ChartBox';
import SellerTopReviewedProductsBar from './components/SellerTopReviewedProductsBar';
import SellerEarningsByCategoryDoughnut from './components/SellerEarningsByCategoryDoughnut';
import SellerTopBuyersBar from './components/SellerTopBuyersBar';
import PieChartBox from '../PieChartBox';

function SellerDashboard() {
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');

  const [userData, setUserData] = useState(null);
  const [totals, setTotals] = useState({ totalSold: 0, totalEarned: 0 });


  useEffect(() => {
    async function fetchAndSetUserData() {
      const sellerQuery = await supabase
        .from('seller')
        .select(`
          buyer_id,
          seller_name,
          applied_at,
          buyer (
            first_name,
            last_name,
            email
          )
        `)
        .eq('seller_id', sellerId)
        .single();

      if (sellerQuery.error) {
        console.error("Supabase error:", sellerQuery.error);
        return;
      }

      setUserData(sellerQuery.data);

      // Fetch total sold and earned
      const soldQuery = await supabase
        .from('order_item')
        .select(`
          quantity,
          product (
            price,
            seller_id
          )
        `);

      if (soldQuery.error) {
        console.error("Supabase sold error:", soldQuery.error);
        return;
      }

      const sellerItems = soldQuery.data.filter(
        (item) => item.product && item.product.seller_id == sellerId
      );

      const totalSold = sellerItems.reduce((sum, item) => sum + item.quantity, 0);

      const totalEarned = sellerItems.reduce(
        (sum, item) => sum + (item.quantity * item.product.price),
        0
      );

      setTotals({ totalSold, totalEarned });
    }

    fetchAndSetUserData();
  }, [sellerId]);

  return (
    <>
      <CheckCredentials>
        <div className='mt-20 flex flex-col p-10'>

          <div className='flex flex-row justify-between w-full'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl text-neutral-700 text-start font-extrabold'>Dashboard for {userData?.seller_name}</h1>
              <h1 className='text-2xl text-neutral-500 text-start font-bold'>
                Seller Name: <Link to={`/dashboard/buyer?buyerId=${userData?.buyer_id}`} className='hover:underline'>{userData?.buyer.first_name} {userData?.buyer.last_name}</Link>
              </h1>
              <h2 className='text-xl text-neutral-500 text-start font-bold'>Email: {userData?.buyer.email}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Date Joined: {new Date(userData?.applied_at).toLocaleString()}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Store ID: {sellerId}</h2>
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl text-neutral-700 text-end font-extrabold'>Total Earned: ₱{totals.totalEarned.toLocaleString()}</h1>
              <h2 className='text-xl text-neutral-500 text-end font-bold'>Total Sold: {totals.totalSold.toLocaleString()}</h2>
            </div>
          </div>

          <div className=' flex flex-row gap-2 mt-5 flex-wrap justify-around flex-grow items-center'>

          <ChartBox title="Most Sold Products">
            <SellerTopProductsBar sellerId={sellerId} />
          </ChartBox>

          <ChartBox title="Most Sold Categories">
            <SellerTopCategoriesBar sellerId={sellerId} />
          </ChartBox>

          <ChartBox title="Monthly Earnings">
            <SellerMonthlyEarningsLineChart sellerId={sellerId} />
          </ChartBox>

          <ChartBox title="Top Reviewed Products">
            <SellerTopReviewedProductsBar sellerId={sellerId} />
          </ChartBox>

          <PieChartBox title="Earnings by Category">
            <SellerEarningsByCategoryDoughnut sellerId={sellerId} />
          </PieChartBox>

          <ChartBox title="Top Buyers">
            <SellerTopBuyersBar sellerId={sellerId} />
          </ChartBox>


          </div>
        </div>
      </CheckCredentials>
    </>
  );
}

export default SellerDashboard;