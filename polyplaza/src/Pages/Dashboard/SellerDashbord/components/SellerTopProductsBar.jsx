import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SellerTopProductsBar({ sellerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`quantity, product:product_id(name, seller_id)`)
        .limit(1000);

      if (error) return console.error(error);
      
      const productCount = {};
      for (const row of data) {
        if (String(row.product.seller_id) !== String(sellerId)) continue;
        const name = row.product.name;
        productCount[name] = (productCount[name] || 0) + row.quantity;
      }

      const top = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      setChartData({
        labels: top.map(([name]) => name),
        datasets: [{
          label: 'Units Sold',
          data: top.map(([_, qty]) => qty),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  return <Bar data={chartData} options={{ indexAxis: 'y' }} />;
}

