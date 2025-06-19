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
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BuyerSpendLineChart({ buyerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data: payments, error } = await supabase
        .from('order_item')
        .select(`
          quantity,
          order(ordered_at, buyer_id),
          product(price)
        `);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const monthlyTotals = {};

      for (const p of payments) {
        if (String(p.order?.buyer_id) !== String(buyerId)) continue;

        const d = new Date(p.order?.ordered_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const spend = p.quantity * parseFloat(p.product?.price || 0);
        monthlyTotals[key] = (monthlyTotals[key] || 0) + spend;
      }

      // Sort keys and slice the last 5 months
      const sortedKeys = Object.keys(monthlyTotals).sort();
      const last5 = sortedKeys.slice(-12);

      const labels = last5;
      const values = last5.map(month => monthlyTotals[month]);

      setChartData({
        labels,
        datasets: [{
          label: 'Monthly Spend (₱)',
          data: values,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  return <Line data={chartData} />;
}
