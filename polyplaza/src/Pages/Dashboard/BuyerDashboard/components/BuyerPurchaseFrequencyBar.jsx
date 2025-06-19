// BuyerPurchaseFrequencyBar.jsx
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

export default function BuyerPurchaseFrequencyBar({ buyerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order')
        .select('ordered_at, buyer_id')
        .eq('buyer_id', buyerId);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const monthlyCount = {};

      for (const order of data) {
        const date = new Date(order.ordered_at);
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
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  return <Bar data={chartData} />;
}
