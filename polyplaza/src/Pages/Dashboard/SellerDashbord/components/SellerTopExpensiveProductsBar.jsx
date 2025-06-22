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

export default function SellerTopExpensiveProductsBar({ sellerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('product')
        .select('name, price')
        .eq('seller_id', sellerId)
        .order('price', { ascending: false })
        .limit(10);

      if (error) return console.error(error);

      const labels = data.map(p => p.name);
      const values = data.map(p => p.price);

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
  }, [sellerId]);

  if (!chartData) return <p>Loading...</p>;

  return <Bar data={chartData} />;
}
