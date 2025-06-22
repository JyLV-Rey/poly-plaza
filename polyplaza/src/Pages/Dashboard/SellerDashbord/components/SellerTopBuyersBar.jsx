import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SellerTopBuyersBar({ sellerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`
          order:order_id (
            order_id,
            buyer_id,
            buyer (
              buyer_id,
              last_name
            )
          ),
          product:product_id (
            seller_id
          )
        `)
        .limit(1000);

      if (error) return console.error(error);

      const buyerOrderCount = {};

      for (const row of data) {
        const sellerMatch = String(row.product?.seller_id) === String(sellerId);
        const buyer = row.order?.buyer;

        if (!sellerMatch || !buyer?.buyer_id || !buyer?.last_name) continue;

        const key = `${buyer.buyer_id}:${buyer.last_name}`;
        buyerOrderCount[key] = (buyerOrderCount[key] || 0) + 1;
      }

      const sorted = Object.entries(buyerOrderCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labels = sorted.map(([key]) => `Buyer ${key.split(":")[1]}`);
      const values = sorted.map(([_, count]) => count);

      setChartData({
        labels,
        datasets: [{
          label: 'Orders',
          data: values,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  if (!chartData) return <p>Loading...</p>;

  return <Bar data={chartData} />;
}
