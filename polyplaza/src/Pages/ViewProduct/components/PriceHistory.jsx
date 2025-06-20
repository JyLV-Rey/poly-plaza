// ProductPriceHistoryLineChart.jsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../../../supabase';

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

function ProductPriceHistoryLineChart({ productId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('price_history')
        .select('price, date_set')
        .eq('product_id', productId)
        .order('date_set', { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const labels = data.map(row =>
        new Date(row.date_set).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      );

      const prices = data.map(row => parseFloat(row.price));

      setChartData({
        labels,
        datasets: [{
          label: 'Price Over Time (₱)',
          data: prices,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.3)',
          fill: true,
          tension: 0.3
        }]
      });
    }

    fetchData();
  }, [productId]);

  return <Line data={chartData} />;
}

export default ProductPriceHistoryLineChart;