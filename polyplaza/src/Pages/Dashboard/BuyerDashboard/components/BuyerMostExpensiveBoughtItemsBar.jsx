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

export default function BuyerMostExpensiveBoughtItemsBar({ buyerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`order(order_id, buyer_id), product:product_id(name, price)`)
        .limit(1000);

      if (error) return console.error(error);

      const items = [];
      for (const row of data) {
        if (String(row.order?.buyer_id) !== String(buyerId)) continue;
        if (!row.product?.price) continue;
        items.push({
          name: row.product.name,
          price: row.product.price
        });
      }

      const sorted = items.sort((a, b) => b.price - a.price).slice(0, 10);
      const labels = sorted.map(p => p.name);
      const values = sorted.map(p => p.price);

      setChartData({
        labels,
        datasets: [{
          label: 'Price (₱)',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  if (!chartData) return <p>Loading...</p>;

  return <Bar data={chartData} />;
}
