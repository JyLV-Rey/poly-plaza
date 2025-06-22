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

export default function SellerPurchaseFrequencyBar({ sellerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`
          order (
            ordered_at
          ),
          product (
            seller_id
          )
        `)
        .limit(1000); // add limit if needed

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const monthlyCount = {};

      for (const row of data) {
        if (!row.product || row.product.seller_id != sellerId) continue;

        const orderedAt = row.order?.ordered_at;
        if (!orderedAt) continue;

        const date = new Date(orderedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCount[key] = (monthlyCount[key] || 0) + 1;
      }

      const labels = Object.keys(monthlyCount).sort();
      const values = labels.map(label => monthlyCount[label]);

      setChartData({
        labels,
        datasets: [{
          label: 'Orders Per Month',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  return <Bar data={chartData} />;
}
