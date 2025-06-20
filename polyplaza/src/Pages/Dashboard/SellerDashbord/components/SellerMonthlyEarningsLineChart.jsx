import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SellerMonthlyEarningsLineChart({ sellerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`quantity, order(ordered_at), product:product_id(price, seller_id)`)
        .order('order(ordered_at)', { ascending: true });

      if (error) return console.error(error);

      const monthlyEarnings = {};
      for (const row of data) {
        if (String(row.product?.seller_id) !== String(sellerId)) continue;
        const date = new Date(row.order.ordered_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const amount = parseFloat(row.product.price) * row.quantity;
        monthlyEarnings[key] = (monthlyEarnings[key] || 0) + amount;
      }

      const labels = Object.keys(monthlyEarnings).sort();
      const values = labels.map(m => monthlyEarnings[m]);

      setChartData({
        labels,
        datasets: [{
          label: 'Earnings (₱)',
          data: values,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  return <Line data={chartData} />;
}
