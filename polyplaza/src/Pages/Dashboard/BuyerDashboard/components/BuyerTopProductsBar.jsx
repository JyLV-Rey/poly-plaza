// BuyerTopProductsBar.jsx
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

export default function BuyerTopProductsBar({ buyerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`
          quantity,
          order(buyer_id),
          product(name)
        `);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const productCounts = {};

      for (const row of data) {
        if (String(row.order?.buyer_id) !== String(buyerId)) continue;

        const name = row.product?.name ?? 'Unnamed Product';
        productCounts[name] = (productCounts[name] || 0) + row.quantity;
      }

      const sorted = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // top 5

      const labels = sorted.map(([name]) => name);
      const values = sorted.map(([, qty]) => qty);

      setChartData({
        labels,
        datasets: [{
          label: 'Top 5 Products Bought',
          data: values,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
      }}
    />
  );
}
