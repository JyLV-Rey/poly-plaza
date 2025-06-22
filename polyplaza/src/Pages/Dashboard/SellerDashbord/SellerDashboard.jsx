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
import SellerTopExpensiveProductsBar from './components/SellerTopExpensiveProductsBar';
import SellerLeastExpensiveProductsBar from './components/SellerLeastExpensiveProductsBar';

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
          is_deleted,
          applied_at,
          buyer (
            first_name,
            phone,
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

  if (!userData) return null;

  if (userData?.is_deleted) return <div className="min-h-screen min-w-screen bg-gray-50 font-extrabold text-neutral-900 flex justify-center items-center text-6xl">Seller is Deleted</div>

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
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Phone: {userData?.buyer.phone}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Date Joined: {new Date(userData?.applied_at).toLocaleString()}</h2>
              <h2 className='text-lg text-neutral-500 text-start font-medium'>Store ID: {sellerId}</h2>
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl text-neutral-700 text-end font-extrabold'>Total Earned: ₱{totals.totalEarned.toLocaleString()}</h1>
              <h2 className='text-xl text-neutral-500 text-end font-bold'>Total Sold: {totals.totalSold.toLocaleString()}</h2>
              <div className='flex flex-row gap-2 align-middle justify-end'>
                <Link to={`/product/create?sellerId=${sellerId}`} className='bg-blue-500 hover:bg-blue-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-blue-500 hover:font-extrabold hover:border-2 border-blue-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>Create Product</Link>
                <Link to={`/search?&searchStore=${userData.seller_name}`} className='bg-pink-500 hover:bg-pink-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-pink-500 hover:font-extrabold hover:border-2 border-pink-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>View Products</Link>
                <Link to={`/edit/seller?sellerId=${sellerId}`} className='bg-emerald-500 hover:bg-emerald-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-emerald-500 hover:font-extrabold hover:border-2 border-emerald-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>Edit Profile</Link>
              </div>
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

          <ChartBox title="Top 10 Most Expensive Items">
            <SellerTopExpensiveProductsBar sellerId={sellerId} />
          </ChartBox>

          <ChartBox title="Top 10 Least Expensive Items">
            <SellerLeastExpensiveProductsBar sellerId={sellerId} />
          </ChartBox>

          </div>
        </div>
      </CheckCredentials>
    </>
  );
}

export default SellerDashboard;