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

export default function BuyerSpendByCategoryBar({ buyerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`
          quantity,
          order(buyer_id),
          product(price, category)
        `);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const categorySpending = {};

      for (const row of data) {
        const buyer = row?.order?.buyer_id;
        const price = parseFloat(row?.product?.price ?? 0);
        const category = row?.product?.category ?? 'Uncategorized';
        const quantity = parseInt(row?.quantity ?? 0);

        if (String(buyer) !== String(buyerId)) continue;

        const spend = price * quantity;
        categorySpending[category] = (categorySpending[category] || 0) + spend;
      }

      // Sort categories by total spend descending
      const sortedEntries = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Take top 10

      const labels = sortedEntries.map(([cat]) => cat);
      const values = sortedEntries.map(([, value]) => value);

      setChartData({
        labels,
        datasets: [{
          label: 'Top 10 Spend Categories (₱)',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  return <Bar data={chartData} />;
}
